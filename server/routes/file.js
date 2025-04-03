import express from "express";
import {
  sendMails,
  uploadPdfMiddleware,
  uploadPdf,
  getFileById,
  downloadFile,
} from "../controllers/file.js";

const router = express.Router();

router.post("/send-approval-emails", sendMails);

router.post("/files/upload", uploadPdfMiddleware, uploadPdf);

router.get("/:id", getFileById);

router.get("/download/:id", downloadFile);

export default router;
