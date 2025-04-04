import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import File from "../models/File.js";
import multer from "multer";
import { PDFDocument } from "pdf-lib";

export const sendMails = async (req, res) => {
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

    const baseUrl = process.env.CLIENT_BASE_URL;

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
                <p><strong>Source Language:</strong> ${translationData.sourceLanguage}</p>
                <p><strong>Target Language:</strong> ${translationData.targetLanguage}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
      
              
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
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log("Received file:", file.originalname, file.mimetype);

    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error(`Only PDF files are allowed. Received: ${file.mimetype}`));
    }
  },
});

export const uploadPdfMiddleware = upload.single("pdfFile");

export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    const newFile = new File({
      fileName: req.body.fileName || req.file.originalname,
      sourceLanguage: req.body.sourceLanguage || "",
      translatedLanguage: req.body.translatedLanguage || "",
      pdfFile: req.file.buffer,
      pdfMimeType: req.file.mimetype,
    });

    await newFile.save();

    res.status(201).json({
      success: true,
      fileId: newFile._id,
      fileName: newFile.fileName,
      sourceLanguage: newFile.sourceLanguage,
      translatedLanguage: newFile.translatedLanguage,
      translated: newFile.translated,
      approvals: {
        approval_1: newFile.approval_1,
        approval_2: newFile.approval_2,
        approval_3: newFile.approval_3,
      },
      createdAt: newFile.createdAt,
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading PDF",
      error: error.message,
    });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find();

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found",
      });
    }

    res.status(200).json({
      success: true,
      files: files.map((file) => ({
        fileId: file._id,
        fileName: file.fileName,
        sourceLanguage: file.sourceLanguage,
        translatedLanguage: file.translatedLanguage,
        translated: file.translated,
        approvals: {
          approval_1: file.approval_1,
          approval_2: file.approval_2,
          approval_3: file.approval_3,
        },
        createdAt: file.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching files",
    });
  }
};

export const changeTranslateStatus = async (req, res) => {
  try {
    const { uploadedFileId } = req.body;

    if (!uploadedFileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    const updatedFile = await File.findByIdAndUpdate(
      uploadedFileId,
      { translated: true },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Translation status updated successfully",
      file: updatedFile,
    });
  } catch (error) {
    console.error("Error changing translate status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing translate status",
    });
  }
};

export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // Convert Buffer to base64 string if it exists
    const pdfFileBase64 = file.pdfFile ? file.pdfFile.toString("base64") : null;

    res.status(200).json({
      success: true,
      fileId: file._id,
      fileName: file.fileName,
      sourceLanguage: file.sourceLanguage,
      translatedLanguage: file.translatedLanguage,
      translated: file.translated,
      approvals: {
        approval_1: file.approval_1,
        approval_2: file.approval_2,
        approval_3: file.approval_3,
      },
      pdfFile: pdfFileBase64,
      pdfMimeType: file.pdfMimeType,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching file" });
  }
};

// Controller to stream/download the file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", file.pdfMimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.fileName}"`
    );

    // Send the file buffer
    res.send(file.pdfFile);
  } catch (error) {
    console.error("Error downloading file:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while downloading file" });
  }
};

export const approveTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (approvedBy === "virtual.squad9@gmail.com") {
      file.approval_1 = true;
    } else if (approvedBy === "ashishthatavarthy9@gmail.com") {
      file.approval_2 = true;
    } else if (approvedBy === "gnani4412@gmail.com") {
      file.approval_3 = true;
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to approve this translation.",
      });
    }

    await file.save();

    res.json({
      success: true,
      message: "Translation approved successfully",
      data: file,
    });
  } catch (error) {
    console.error("Error approving translation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//added

export const saveEditedPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No edited PDF file uploaded",
      });
    }

    const { originalFileId } = req.body;

    // If an original file ID is provided, we're updating an existing file
    if (originalFileId) {
      const originalFile = await File.findById(originalFileId);

      if (!originalFile) {
        return res.status(404).json({
          success: false,
          message: "Original file not found",
        });
      }

      // Update the existing file with the edited version
      originalFile.pdfFile = req.file.buffer;
      originalFile.updatedAt = new Date();
      await originalFile.save();

      return res.status(200).json({
        success: true,
        message: "PDF updated successfully",
        fileId: originalFile._id,
        fileName: originalFile.fileName,
      });
    } else {
      // Create a new file entry for the edited PDF
      const newFile = new File({
        fileName: req.body.fileName || req.file.originalname,
        sourceLanguage: req.body.sourceLanguage || "",
        translatedLanguage: req.body.translatedLanguage || "",
        pdfFile: req.file.buffer,
        pdfMimeType: req.file.mimetype,
      });

      await newFile.save();

      return res.status(201).json({
        success: true,
        message: "Edited PDF saved successfully",
        fileId: newFile._id,
        fileName: newFile.fileName,
      });
    }
  } catch (error) {
    console.error("Error saving edited PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving edited PDF",
      error: error.message,
    });
  }
};

// Controller to get PDF preview without downloading
export const getPdfPreview = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Set appropriate headers for inline viewing
    res.setHeader("Content-Type", file.pdfMimeType);
    res.setHeader("Content-Disposition", `inline; filename="${file.fileName}"`);

    // Send the file buffer
    res.send(file.pdfFile);
  } catch (error) {
    console.error("Error serving PDF preview:", error);
    res.status(500).json({
      success: false,
      message: "Server error while serving PDF preview",
    });
  }
};
