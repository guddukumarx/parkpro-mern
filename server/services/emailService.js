// services/emailService.js
import nodemailer from "nodemailer";

// Create reusable transporter object using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email using the configured transporter
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "ParkPro <noreply@parkpro.com>",
      to,
      subject,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error; // Re-throw to allow caller to handle if needed
  }
};

// ==================== Email Templates ====================

/**
 * Send welcome email to new user
 * @param {Object} user - User object containing name and email
 */
export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ParkPro!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Thank you for registering with ParkPro! We're excited to help you find and book parking spots effortlessly.</p>
          <p>With ParkPro you can:</p>
          <ul>
            <li>Search for available parking in real-time</li>
            <li>Book spots instantly</li>
            <li>Manage your bookings</li>
            <li>Get exclusive offers</li>
          </ul>
          <p>Start your first booking now!</p>
          <p><a href="${process.env.CLIENT_URL || "http://localhost:5173"}" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to ParkPro</a></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ParkPro. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail({ to: user.email, subject: "Welcome to ParkPro!", html });
};

/**
 * Send booking confirmation email
 * @param {Object} booking - Booking object with populated parking and slot
 * @param {Object} user - User object
 */
export const sendBookingConfirmationEmail = async (booking, user) => {
  const startTime = new Date(booking.startTime).toLocaleString();
  const endTime = new Date(booking.endTime).toLocaleString();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4caf50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .booking-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your booking has been confirmed.</p>
          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Parking:</strong> ${booking.parking.name}</p>
            <p><strong>Address:</strong> ${booking.parking.address}, ${booking.parking.city}</p>
            <p><strong>Slot:</strong> ${booking.slot.slotNumber}</p>
            <p><strong>Date & Time:</strong> ${startTime} to ${endTime}</p>
            <p><strong>Total Amount:</strong> $${booking.totalPrice.toFixed(2)}</p>
            <p><strong>Vehicle Number:</strong> ${booking.vehicleNumber || "Not provided"}</p>
          </div>
          <p>You can view your booking details in your dashboard.</p>
          <p><a href="${process.env.CLIENT_URL || "http://localhost:5173"}/user/bookings" style="background-color: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View My Bookings</a></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ParkPro. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail({
    to: user.email,
    subject: "Booking Confirmed - ParkPro",
    html,
  });
};

/**
 * Send booking cancellation email
 * @param {Object} booking - Booking object with populated parking and slot
 * @param {Object} user - User object
 */
export const sendBookingCancelledEmail = async (booking, user) => {
  const startTime = new Date(booking.startTime).toLocaleString();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .booking-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancelled</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your booking has been cancelled as requested.</p>
          <div class="booking-details">
            <h3>Cancelled Booking Details</h3>
            <p><strong>Parking:</strong> ${booking.parking.name}</p>
            <p><strong>Address:</strong> ${booking.parking.address}, ${booking.parking.city}</p>
            <p><strong>Slot:</strong> ${booking.slot.slotNumber}</p>
            <p><strong>Date & Time:</strong> ${startTime}</p>
            <p><strong>Amount:</strong> $${booking.totalPrice.toFixed(2)}</p>
          </div>
          <p>If a refund is applicable, it will be processed within 5-7 business days.</p>
          <p><a href="${process.env.CLIENT_URL || "http://localhost:5173"}/user/bookings" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View My Bookings</a></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ParkPro. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail({
    to: user.email,
    subject: "Booking Cancelled - ParkPro",
    html,
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetLink - Password reset link
 */
export const sendPasswordResetEmail = async (user, resetLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to set a new password.</p>
          <p><a href="${resetLink}" style="background-color: #ff9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ParkPro. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request - ParkPro",
    html,
  });
};

/**
 * Send contact form auto-reply
 * @param {Object} data - Contact form data
 */
export const sendContactAutoReply = async (data) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting ParkPro</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${data.name}</strong>,</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <p>Your message:</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, "<br/>")}</p>
          <p>Best regards,<br/>The ParkPro Team</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ParkPro. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail({
    to: data.email,
    subject: "Thank You for Contacting ParkPro",
    html,
  });
};
