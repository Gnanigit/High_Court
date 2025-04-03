import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    sourceLanguage: {
      type: String,
    },
    translatedLanguage: {
      type: String,
    },
    translated: {
      type: Boolean,
      default: false,
    },
    approval_1: {
      type: Boolean,
      default: false,
    },
    approval_2: {
      type: Boolean,
      default: false,
    },
    approval_3: {
      type: Boolean,
      default: false,
    },
    pdfFile: {
      type: Buffer,
      required: true,
    },
    pdfMimeType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;
