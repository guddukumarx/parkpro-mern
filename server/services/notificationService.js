// services/notificationService.js
import Notification from "../models/Notification.js";
import { sendEmail } from "./emailService.js";
import { getIO } from "../socket/socket.js";

export const sendNotification = async ({
  user,
  type = "in-app",
  title,
  message,
  data = {},
}) => {
  try {
    const notification = await Notification.create({
      user: user._id,
      type,
      title,
      message,
      data,
    });

    if (type === "email" || type === "both") {
      try {
        await sendEmail({
          to: user.email,
          subject: title,
          html: `<p>${message}</p>`,
        });
        notification.emailSent = true;
      } catch (error) {
        notification.emailError = error.message;
      }
      await notification.save();
    }

    if (type === "in-app" || type === "both") {
      const io = getIO();
      io.to(user._id.toString()).emit("new-notification", notification);
    }

    return notification;
  } catch (error) {
    console.error("Notification send error:", error);
    return null;
  }
};
