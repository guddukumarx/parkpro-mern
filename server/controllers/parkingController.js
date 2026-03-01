// controllers/parkingController.js
import Parking from "../models/Parking.js";
import Slot from "../models/Slot.js";
import Booking from "../models/Booking.js";

// @desc    Get all parking locations (public)
// @route   GET /api/parkings
// @access  Public
export const getAllParkings = async (req, res) => {
  try {
    const { city, lat, lng, radius, limit = 10, page = 1 } = req.query;
    let query = { status: "active" };
    let sort = {};

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius) * 1000,
        },
      };
    }

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: sort,
    };

    const parkings = await Parking.find(query, null, options).populate(
      "owner",
      "name email",
    );
    const total = await Parking.countDocuments(query);

    res.json({
      success: true,
      data: parkings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single parking by ID
// @route   GET /api/parkings/:id
// @access  Public
export const getParkingById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id).populate(
      "owner",
      "name email",
    );
    if (!parking) {
      return res
        .status(404)
        .json({ success: false, message: "Parking not found" });
    }
    res.json({ success: true, data: parking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check slot availability for a parking
// @route   GET /api/parkings/:id/slots/availability
// @access  Public
export const checkSlotAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;
    const parkingId = req.params.id;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide date, startTime, and endTime",
      });
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (startDateTime >= endDateTime) {
      return res
        .status(400)
        .json({ success: false, message: "End time must be after start time" });
    }

    const slots = await Slot.find({
      parking: parkingId,
      status: { $ne: "maintenance" },
    });

    const bookings = await Booking.find({
      parking: parkingId,
      status: { $in: ["confirmed", "active"] },
      $or: [
        { startTime: { $lt: endDateTime }, endTime: { $gt: startDateTime } },
      ],
    }).populate("slot");

    const bookedSlotIds = new Set(bookings.map((b) => b.slot._id.toString()));
    const availableSlots = slots.filter(
      (slot) => !bookedSlotIds.has(slot._id.toString()),
    );

    res.json({ success: true, data: availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new parking (owner only)
// @route   POST /api/owner/parkings
// @access  Private (owner)
export const createParking = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      coordinates,
      images,
      amenities,
      description,
      pricePerHour,
    } = req.body;

    const parking = await Parking.create({
      name,
      address,
      city,
      location: {
        type: "Point",
        coordinates: coordinates || [0, 0],
      },
      owner: req.user._id,
      images,
      amenities,
      description,
      pricePerHour,
    });

    res.status(201).json({ success: true, data: parking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a parking (owner only)
// @route   PUT /api/owner/parkings/:parkingId   // ✅ corrected comment
// @access  Private (owner)
export const updateParking = async (req, res) => {
  try {
    const parking = await Parking.findOne({
      _id: req.params.parkingId, // ✅ changed from id to parkingId
      owner: req.user._id,
    });
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found or not authorized",
      });
    }

    Object.assign(parking, req.body);
    await parking.save();

    res.json({ success: true, data: parking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a parking (owner only)
// @route   DELETE /api/owner/parkings/:parkingId   // ✅ corrected comment
// @access  Private (owner)
export const deleteParking = async (req, res) => {
  try {
    const parking = await Parking.findOneAndDelete({
      _id: req.params.parkingId, // ✅ changed from id to parkingId
      owner: req.user._id,
    });
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found or not authorized",
      });
    }

    await Slot.deleteMany({ parking: parking._id });

    res.json({ success: true, message: "Parking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all parkings for the logged-in owner
// @route   GET /api/owner/parkings
// @access  Private (owner)
export const getOwnerParkings = async (req, res) => {
  try {
    const parkings = await Parking.find({ owner: req.user._id }).populate(
      "owner",
      "name email",
    );
    res.json({ success: true, data: parkings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Slot Management (Owner) ---

// @desc    Add a slot to a parking (owner only)
// @route   POST /api/owner/parkings/:parkingId/slots   // ✅ corrected comment
// @access  Private (owner)
export const addSlot = async (req, res) => {
  try {
    const parkingId = req.params.parkingId;
    let { slotNumber, type, pricePerHour, status } = req.body;

    // Convert price to number (if it's a string)
    if (pricePerHour !== undefined && pricePerHour !== null) {
      pricePerHour = Number(pricePerHour);
      if (isNaN(pricePerHour) || pricePerHour < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number",
        });
      }
    }

    const parking = await Parking.findOne({
      _id: parkingId,
      owner: req.user._id,
    });
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found or not authorized",
      });
    }

    const slotData = {
      parking: parkingId,
      slotNumber,
      type,
      // Use provided price, otherwise fallback to parking's price
      pricePerHour:
        pricePerHour !== undefined ? pricePerHour : parking.pricePerHour,
      status: status || "available",
    };

    const slot = await Slot.create(slotData);

    // Update parking counts
    parking.totalSlots += 1;
    if (slot.status === "available") {
      parking.availableSlots += 1;
    }
    await parking.save();

    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    console.error("Add slot error:", error);
    // Send a more specific message if it's a validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Slot number already exists for this parking.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Update a slot (owner only)
// @route   PUT /api/owner/slots/:slotId
// @access  Private (owner)
export const updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.slotId).populate("parking");
    if (!slot) {
      return res
        .status(404)
        .json({ success: false, message: "Slot not found" });
    }

    if (slot.parking.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const oldStatus = slot.status;
    Object.assign(slot, req.body);
    await slot.save();

    if (oldStatus !== slot.status) {
      const parking = await Parking.findById(slot.parking._id);
      if (oldStatus === "available" && slot.status !== "available") {
        parking.availableSlots -= 1;
      } else if (oldStatus !== "available" && slot.status === "available") {
        parking.availableSlots += 1;
      }
      await parking.save();
    }

    res.json({ success: true, data: slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a slot (owner only)
// @route   DELETE /api/owner/slots/:slotId
// @access  Private (owner)
export const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.slotId).populate("parking");
    if (!slot) {
      return res
        .status(404)
        .json({ success: false, message: "Slot not found" });
    }

    if (slot.parking.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await slot.deleteOne();

    const parking = await Parking.findById(slot.parking._id);
    parking.totalSlots -= 1;
    if (slot.status === "available") {
      parking.availableSlots -= 1;
    }
    await parking.save();

    res.json({ success: true, message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all slots for a specific parking (owner only)
// @route   GET /api/owner/parkings/:parkingId/slots
// @access  Private (owner)
export const getSlotsByParking = async (req, res) => {
  try {
    const parkingId = req.params.parkingId;
    const parking = await Parking.findOne({
      _id: parkingId,
      owner: req.user._id,
    });
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found or not authorized",
      });
    }

    const slots = await Slot.find({ parking: parkingId });
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Admin Endpoints ---

// @desc    Get all parkings (admin only)
// @route   GET /api/admin/parkings
// @access  Private (admin)
export const getAllParkingsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, city } = req.query;
    const query = {};
    if (status) query.status = status;
    if (city) query.city = { $regex: city, $options: "i" };

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const parkings = await Parking.find(query, null, options).populate(
      "owner",
      "name email",
    );
    const total = await Parking.countDocuments(query);

    res.json({
      success: true,
      data: parkings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update any parking (admin only)
// @route   PUT /api/admin/parkings/:id
// @access  Private (admin)
export const updateParkingAdmin = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    if (!parking) {
      return res
        .status(404)
        .json({ success: false, message: "Parking not found" });
    }

    Object.assign(parking, req.body);
    await parking.save();

    res.json({ success: true, data: parking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete any parking (admin only)
// @route   DELETE /api/admin/parkings/:id
// @access  Private (admin)
export const deleteParkingAdmin = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(req.params.id);
    if (!parking) {
      return res
        .status(404)
        .json({ success: false, message: "Parking not found" });
    }

    await Slot.deleteMany({ parking: parking._id });

    res.json({ success: true, message: "Parking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
