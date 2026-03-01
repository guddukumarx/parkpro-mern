// controllers/maintenanceController.js
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import Parking from "../models/Parking.js";
import User from "../models/User.js";
import { sendNotification } from "../services/notificationService.js";
import { createAuditLog } from "../services/auditService.js";

/**
 * Create a new maintenance request (owner only)
 */
export const createMaintenanceRequest = async (req, res) => {
  try {
    const { parkingId, slotId, title, description, priority } = req.body;

    // Validate required fields
    if (!parkingId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: parkingId, title, description",
      });
    }

    // Ensure user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check parking ownership
    const parking = await Parking.findOne({
      _id: parkingId,
      owner: req.user._id,
    });
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found or you are not authorized",
      });
    }

    // Create maintenance request
    const request = await MaintenanceRequest.create({
      parking: parkingId,
      slot: slotId || null,
      title,
      description,
      priority: priority || "medium",
      reportedBy: req.user._id,
    });

    // Optional: Notify admins (non‑blocking)
    try {
      const admins = await User.find({ role: "admin" }).select("_id name");
      const notificationPromises = admins.map((admin) =>
        sendNotification({
          user: admin._id, // or admin object – adjust based on your service
          type: "in-app",
          title: "New Maintenance Request",
          message: `Request from ${req.user.name || "an owner"}: ${title}`,
          data: { requestId: request._id },
        }).catch((err) => {
          console.error(
            `❌ Notification failed for admin ${admin._id}:`,
            err.message,
          );
        }),
      );
      await Promise.allSettled(notificationPromises);
    } catch (notifError) {
      // Log but don't fail the request
      console.error(
        "⚠️ Notification error (non‑critical):",
        notifError.message,
      );
    }

    // Audit log (optional)
    try {
      await createAuditLog({
        user: req.user._id,
        action: "CREATE",
        entity: "MaintenanceRequest",
        entityId: request._id,
        ip: req.clientIp,
        userAgent: req.userAgent,
        details: `Maintenance request created: ${title}`,
      });
    } catch (auditError) {
      console.error("⚠️ Audit log error (non‑critical):", auditError.message);
    }

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("🔥 Maintenance creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get maintenance requests for the logged‑in owner's parkings
 */
export const getOwnerMaintenanceRequests = async (req, res) => {
  try {
    const parkings = await Parking.find({ owner: req.user._id }).select("_id");
    const parkingIds = parkings.map((p) => p._id);

    const { status, page = 1, limit = 10 } = req.query;
    const query = { parking: { $in: parkingIds } };
    if (status) query.status = status;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: ["parking", "slot"],
    };

    const requests = await MaintenanceRequest.find(query, null, options);
    const total = await MaintenanceRequest.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("🔥 Get owner maintenance requests error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update a maintenance request (owner of the parking or admin)
 */
export const updateMaintenanceRequest = async (req, res) => {
  try {
    const { status, resolutionNotes, assignedTo } = req.body;
    const request = await MaintenanceRequest.findById(req.params.id).populate(
      "parking",
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const isOwner =
      request.parking.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (status) request.status = status;
    if (resolutionNotes) request.resolutionNotes = resolutionNotes;
    if (assignedTo && isAdmin) request.assignedTo = assignedTo;
    if (status === "resolved") request.resolvedAt = new Date();

    await request.save();

    // Notify the reporter (if status changed)
    if (status) {
      try {
        const reporter = await User.findById(request.reportedBy);
        if (reporter) {
          await sendNotification({
            user: reporter._id,
            type: "in-app",
            title: "Maintenance Request Updated",
            message: `Your request "${request.title}" is now ${status}`,
            data: { requestId: request._id },
          });
        }
      } catch (notifError) {
        console.error(
          "⚠️ Status update notification failed:",
          notifError.message,
        );
      }
    }

    // Audit log
    try {
      await createAuditLog({
        user: req.user._id,
        action: "UPDATE",
        entity: "MaintenanceRequest",
        entityId: request._id,
        ip: req.clientIp,
        userAgent: req.userAgent,
        details: `Maintenance request updated: ${request.title}`,
      });
    } catch (auditError) {
      console.error("⚠️ Audit log error:", auditError.message);
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("🔥 Update maintenance request error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete a maintenance request (owner of the parking or admin)
 */
export const deleteMaintenanceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await MaintenanceRequest.findById(id).populate("parking");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const isOwner =
      request.parking.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await request.deleteOne();

    // Audit log
    try {
      await createAuditLog({
        user: req.user._id,
        action: "DELETE",
        entity: "MaintenanceRequest",
        entityId: id,
        ip: req.clientIp,
        userAgent: req.userAgent,
        details: `Maintenance request deleted: ${request.title}`,
      });
    } catch (auditError) {
      console.error("⚠️ Audit log error:", auditError.message);
    }

    res.json({
      success: true,
      message: "Maintenance request deleted",
    });
  } catch (error) {
    console.error("🔥 Delete maintenance request error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all maintenance requests (admin only)
 */
export const getAllMaintenanceRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: ["parking", "slot", "reportedBy", "assignedTo"],
    };

    const requests = await MaintenanceRequest.find(query, null, options);
    const total = await MaintenanceRequest.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("🔥 Get all maintenance requests error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
