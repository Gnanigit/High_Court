import axios from "axios";
import { addFile } from "../store/slices/fileSlice";

const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const sendMails = async (translationData, fileName, dispatch = null) => {
  const approvers = [
    { email: "virtual.squad9@gmail.com", name: "Approver 1" },
    { email: "ashishthatavarthy9@gmail.com", name: "Approver 2" },
    { email: "gnani4412@gmail.com", name: "Approver 3" },
  ];

  try {
    const response = await axios.post(
      `${backend_url}/api/send-approval-emails`,
      {
        approvers,
        translationData,
        fileName,
        subject: `Approval Request: Translation of ${fileName}`,
        message: `A new document translation requires your approval. The document "${fileName}" has been translated and needs your review.`,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending approval emails:", error);
    throw error;
  }
};

export const uploadPdfFile = async (
  file,
  sourceLanguage,
  targetLanguage,
  dispatch = null
) => {
  try {
    // Create FormData to send the file and related details
    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("fileName", file.name);
    formData.append("sourceLanguage", sourceLanguage);
    formData.append("translatedLanguage", targetLanguage);

    const response = await axios.post(
      `${backend_url}/api/files/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    if (dispatch && response.data) {
      dispatch(addFile(response.data));
    }

    return response.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      console.error(
        "Network error during file upload. Check if the backend server is running and the URL is correct:",
        backend_url
      );
    }
    console.error("PDF upload error:", error);
    throw error;
  }
};

export const getFileById = async (fileId) => {
  try {
    const response = await axios.get(`${backend_url}/api/files/${fileId}`);

    const fileData = response.data;

    return fileData;
  } catch (error) {
    console.error("Fetch file error:", error);
    throw error;
  }
};

export const getAllFiles = async () => {
  try {
    const response = await axios.get(`${backend_url}/api/files`);
    return response.data.files;
  } catch (error) {
    console.error("Fetch all files error:", error);
    throw error;
  }
};

export const changeTranslateStatus = async (uploadedFileId) => {
  try {
    const response = await axios.post(
      `${backend_url}/api/translate-status`,
      { uploadedFileId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Fetch translate status error:", error);
    throw error;
  }
};

export const fetchAllFiles = async () => {
  try {
    console.log(backend_url);
    const response = await axios.get(`${backend_url}/api/files`);
    if (response.data.success) {
      return response.data.files;
    }
    throw new Error(response.data.message || "Failed to fetch files");
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

// Get preview URL for a file
export const getFilePreviewUrl = (fileId) => {
  return `${backend_url}/api/files/preview/${fileId}`;
};

// Save edited PDF
export const saveEditedPdf = async (
  editedPdfBlob,
  fileName,
  originalFileId
) => {
  try {
    const formData = new FormData();
    formData.append("pdfFile", editedPdfBlob, fileName);

    if (originalFileId) {
      formData.append("originalFileId", originalFileId);
    }

    const response = await axios.post(
      `${backend_url}/files/save-edited`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Unknown error");
    }

    return response.data;
  } catch (error) {
    console.error("Error saving PDF:", error);
    throw error;
  }
};

// Upload new PDF file
export const uploadPdfFileEditor = async (file) => {
  if (!file || file.type !== "application/pdf") {
    throw new Error("Please select a valid PDF file.");
  }

  try {
    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("fileName", file.name);

    const response = await axios.post(
      `${BASE_URL}/api/files/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Unknown error");
    }

    return response.data;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
};
