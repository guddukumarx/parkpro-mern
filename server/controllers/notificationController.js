// controllers/notificationController.js
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendNotification } from "../services/notificationService.js";

export const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const query = { user: req.user._id };
    if (unreadOnly === "true") query.isRead = false;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const notifications = await Notification.find(query, null, options);
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
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

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendBulkNotification = async (req, res) => {
  try {
    const { recipient, userIds, title, message, type = "both" } = req.body;
    let users = [];
    if (recipient === "all") {
      users = await User.find({}, "_id email");
    } else if (recipient === "users") {
      users = await User.find({ role: "user" }, "_id email");
    } else if (recipient === "owners") {
      users = await User.find({ role: "owner" }, "_id email");
    } else if (recipient === "specific" && userIds) {
      users = await User.find({ _id: { $in: userIds } }, "_id email");
    }

    const results = await Promise.allSettled(
      users.map((u) => sendNotification({ user: u, type, title, message })),
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    res.json({ success: true, data: { total: users.length, successCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
