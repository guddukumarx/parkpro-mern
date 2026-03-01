// server.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http"; // ✅ Required for Socket.io
import { initializeSocket } from "./socket/socket.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import ownerMaintenanceRoutes from "./routes/ownerMaintenanceRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { captureRequestMetadata } from "./middleware/audit.js";
import { validateCoupon, useCoupon } from "./controllers/couponController.js";
import EmailTemplate from "./models/EmailTemplate.js";

// Connect to database
connectDB();

const app = express();

// Seed email templates
const seedEmailTemplates = async () => {
  const templates = [
    {
      name: "welcome",
      subject: "Welcome to ParkPro!",
      body: "<h1>Welcome {{name}}!</h1><p>Thank you for registering.</p>",
      variables: ["name"],
    },
    {
      name: "bookingConfirmed",
      subject: "Booking Confirmed",
      body: "<h1>Booking Confirmed</h1><p>Your booking at {{parking}} is confirmed.</p>",
      variables: ["name", "parking", "slot", "startTime", "endTime"],
    },
    {
      name: "bookingCancelled",
      subject: "Booking Cancelled",
      body: "<h1>Booking Cancelled</h1><p>Your booking has been cancelled.</p>",
      variables: ["name", "bookingId"],
    },
    {
      name: "forgotPassword",
      subject: "Reset Your Password",
      body: '<p>Click <a href="{{resetLink}}">here</a> to reset your password.</p>',
      variables: ["name", "resetLink"],
    },
  ];
  for (const t of templates) {
    await EmailTemplate.findOneAndUpdate({ name: t.name }, t, { upsert: true });
  }
};
await seedEmailTemplates();

// Middleware
app.use(cors());
app.use(express.json());
app.use(captureRequestMetadata);

// Routes
app.use("/api/staff", staffRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/parkings", parkingRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/owner/maintenance", ownerMaintenanceRoutes);
app.use("/api", contactRoutes);

// Coupon routes (public)
app.post("/api/coupons/validate", validateCoupon);
app.post("/api/coupons/:id/use", useCoupon);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// 🚀 Create HTTP server and initialize Socket.io
const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
