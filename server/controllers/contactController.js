// controllers/contactController.js
import { sendEmail, sendContactAutoReply } from "../services/emailService.js";
import Setting from "../models/Setting.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Get admin email from settings (fallback to env or default)
    const adminEmailSetting = await Setting.findOne({ key: "adminEmail" });
    const adminEmail =
      adminEmailSetting?.value ||
      process.env.ADMIN_EMAIL ||
      "admin@parkpro.com";

    // Send email to admin
    await sendEmail({
      to: adminEmail,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #1976d2; color: white; padding: 10px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field"><span class="label">Name:</span> ${name}</div>
              <div class="field"><span class="label">Email:</span> ${email}</div>
              <div class="field"><span class="label">Subject:</span> ${subject}</div>
              <div class="field"><span class="label">Message:</span></div>
              <p>${message.replace(/\n/g, "<br/>")}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send auto-reply to user using the dedicated template
    await sendContactAutoReply({ name, email, subject, message });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send message. Please try again later.",
      });
  }
};
