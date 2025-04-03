import express from "express";
import {
  sendMails,
  uploadPdfMiddleware,
  uploadPdf,
  getFileById,
  downloadFile,
  getAllFiles,
} from "../controllers/file.js";

const router = express.Router();

router.post("/send-approval-emails", sendMails);

router.post("/files/upload", uploadPdfMiddleware, uploadPdf);

router.get("/files", getAllFiles);

router.get("/files/:id", getFileById);

router.get("/files/download/:id", downloadFile);

export default router;
