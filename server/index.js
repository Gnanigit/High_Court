// server/index.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/send-approval-emails", async (req, res) => {
  try {
    const { approvers, translationData, fileName, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const baseUrl = process.env.CLIENT_BASE_URL || "http://localhost:5173";

    const emailPromises = approvers.map(async (approver) => {
      const approvalLink = `${baseUrl}/approve/${
        translationData.translationId
      }?reviewer=${encodeURIComponent(approver.email)}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Translation Approval Request</h2>
          <p>Hello ${approver.name},</p>
          <p>${message}</p>
          
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
            <p><strong>Document:</strong> ${fileName}</p>
            <p><strong>Source Language:</strong> ${
              translationData.sourceLanguage
            }</p>
            <p><strong>Target Language:</strong> ${
              translationData.targetLanguage
            }</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
            <h3>Translation Preview:</h3>
            <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
              <p><strong>Original:</strong></p>
              <p>${translationData.sourceText.substring(0, 200)}${
        translationData.sourceText.length > 200 ? "..." : ""
      }</p>
            </div>
            <div style="background: #f9f9f9; padding: 10px; border-radius: 4px;">
              <p><strong>Translated:</strong></p>
              <p>${translationData.translatedText.substring(0, 200)}${
        translationData.translatedText.length > 200 ? "..." : ""
      }</p>
            </div>
          </div>
          
          <div style="margin: 25px 0; text-align: center;">
            <a href="${approvalLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Review and Approve</a>
          </div>
          
          <p>Thank you for your time.</p>
          <p>Best regards,<br>Translation System</p>
        </div>
      `;

      return transporter.sendMail({
        from:
          process.env.EMAIL_FROM ||
          '"Translation System" <notifications@example.com>',
        to: approver.email,
        subject: subject,
        html: htmlContent,
      });
    });

    await Promise.all(emailPromises);

    return res
      .status(200)
      .json({ success: true, message: "Approval emails sent successfully" });
  } catch (error) {
    console.error("Error sending approval emails:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send approval emails",
      error: error.message,
    });
  }
});

app.get("/api/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "gnani4412@gmail.com",
      subject: "Test Email",
      text: "This is a test email from your server.",
    });

    res.status(200).json({ success: true, message: "Test email sent!" });
  } catch (error) {
    console.error("Email test failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
