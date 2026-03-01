// backend/services/auditService.js
import AuditLog from "../models/AuditLog.js";

/**
 * Create a new audit log entry
 * @param {Object} data - { user, action, entity, entityId, changes, ip, userAgent, details }
 */
export const createAuditLog = async ({
  user,
  action,
  entity,
  entityId = null,
  changes = null,
  ip = null,
  userAgent = null,
  details = null,
}) => {
  try {
    await AuditLog.create({
      user,
      action,
      entity,
      entityId,
      changes,
      ip,
      userAgent,
      details,
    });
  } catch (error) {
    console.error("Audit log creation failed:", error);
    // Fail silently – audit should not break main flow
  }
};

/**
 * Get audit logs with filtering, sorting, and pagination
 * @param {Object} options - { page, limit, userId, action, entity, entityId, startDate, endDate, sortBy, sortOrder }
 */
export const getAuditLogs = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      entity,
      entityId,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const query = {};

    if (userId) query.user = userId;
    if (action) query.action = action;
    if (entity) query.entity = entity;
    if (entityId) query.entityId = entityId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate("user", "name email")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(query),
    ]);

    return {
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get audit logs error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get a single audit log by ID
 * @param {string} id - Audit log ID
 */
export const getAuditLogById = async (id) => {
  try {
    const log = await AuditLog.findById(id).populate("user", "name email");
    if (!log) {
      return { success: false, message: "Audit log not found" };
    }
    return { success: true, data: log };
  } catch (error) {
    console.error("Get audit log by ID error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get audit logs for a specific user
 * @param {string} userId - User ID
 * @param {Object} options - Pagination options
 */
export const getAuditLogsByUser = async (userId, options = {}) => {
  return getAuditLogs({ ...options, userId });
};

/**
 * Get audit logs for a specific entity (e.g., all logs for a booking)
 * @param {string} entity - Entity name (e.g., 'Booking')
 * @param {string} entityId - Entity ID
 * @param {Object} options - Pagination options
 */
export const getAuditLogsByEntity = async (entity, entityId, options = {}) => {
  return getAuditLogs({ ...options, entity, entityId });
};

/**
 * Delete an audit log by ID (admin only)
 * @param {string} id - Audit log ID
 */
export const deleteAuditLog = async (id) => {
  try {
    const log = await AuditLog.findByIdAndDelete(id);
    if (!log) {
      return { success: false, message: "Audit log not found" };
    }
    return { success: true, message: "Audit log deleted" };
  } catch (error) {
    console.error("Delete audit log error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Delete audit logs older than a certain date (cleanup)
 * @param {Date} beforeDate - Delete logs created before this date
 */
export const deleteOldAuditLogs = async (beforeDate) => {
  try {
    const result = await AuditLog.deleteMany({
      createdAt: { $lt: beforeDate },
    });
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error("Delete old audit logs error:", error);
    return { success: false, message: error.message };
  }
};
