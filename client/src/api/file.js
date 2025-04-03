import axios from "axios";
import { addFile } from "../store/slices/fileSlice";

const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const sendMails = async (translationData, fileName, dispatch = null) => {
  const approvers = [
    { email: "gnani4412@gmail.com", name: "Approver 1" },
    { email: "21pa1a0553@vishnu.edu.in", name: "Approver 2" },
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

export const getFileById = async (fileId, dispatch = null) => {
  try {
    const response = await axios.get(`${backend_url}/api/files/${fileId}`);

    // If dispatch function is provided, add file to Redux store
    if (dispatch && response.data) {
      dispatch(addFile(response.data));
    }

    return response.data;
  } catch (error) {
    console.error("Fetch file error:", error);
    throw error;
  }
};

export const getAllFiles = async () => {
  try {
    const response = await axios.get(`${backend_url}/api/files`);
    console.log(response.data);
    return response.data.files;
  } catch (error) {
    console.error("Fetch all files error:", error);
    throw error;
  }
};
