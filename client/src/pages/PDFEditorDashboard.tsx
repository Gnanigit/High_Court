import React, { useState, useEffect } from "react";
import PDFViewer from "../components/PDFViewer";
import PDFEditor from "../components/PDFEditor";
import {
  fetchAllFiles,
  getFilePreviewUrl,
  saveEditedPdf,
  uploadPdfFileEditor,
} from "../api/file"; // Adjust the import path as needed

const PDFEditorDashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [teluguPdfUrl, setTeluguPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all files when component mounts
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const filesData = await fetchAllFiles();
      setFiles(filesData);
    } catch (error) {
      setMessage("Error fetching files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (fileId) => {
    setIsLoading(true);
    setMessage("");

    try {
      // Find the file in our state
      const file = files.find((f) => f.fileId === fileId);
      if (file) {
        setSelectedFile(file);

        // Generate a preview URL for the selected file
        const previewUrl = getFilePreviewUrl(fileId);
        setPdfUrl(previewUrl);

        // Generate the corresponding Telugu PDF URL
        const fileName = file.fileName;
        const dashIndex = fileName.indexOf("-");
        const baseName =
          dashIndex !== -1
            ? fileName.substring(0, dashIndex)
            : fileName.replace(/\.pdf$/, "");

        // Following the pattern from TranslationDisplay component
        const teluguFileName = `${baseName}-Telugu.pdf`;

        // Make sure URL is properly formed for the server environment
        // This should match your server's file structure
        const teluguUrl = `/QIT_Model/${teluguFileName}`;

        console.log("Setting Telugu PDF URL:", teluguUrl);
        setTeluguPdfUrl(teluguUrl);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      setMessage("Error selecting file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePdf = async (editedPdfBlob) => {
    setIsLoading(true);
    setMessage("");

    try {
      // Extract just the filename part for saving
      const teluguFilename = teluguPdfUrl
        ? teluguPdfUrl.split("/").pop()
        : null;

      if (!teluguFilename) {
        throw new Error("Telugu filename could not be determined");
      }

      const result = await saveEditedPdf(
        editedPdfBlob,
        teluguFilename, // Use the Telugu filename for saving
        selectedFile.fileId
      );

      setMessage("PDF saved successfully!");
      // Refresh the file list
      loadFiles();
    } catch (error) {
      console.error("Error saving PDF:", error);
      setMessage(`Error saving PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setMessage("");

    try {
      const data = await uploadPdfFileEditor(file);
      setMessage("File uploaded successfully!");
      loadFiles();
      // Automatically select the newly uploaded file
      if (data.fileId) {
        handleFileSelect(data.fileId);
      }
    } catch (error) {
      setMessage(`Error uploading file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to test direct PDF URL
  const testPdfUrl = (url) => {
    if (!url) return;

    // Ensure the URL is absolute
    const absoluteUrl = url.startsWith("http")
      ? url
      : window.location.origin + (url.startsWith("/") ? url : `/${url}`);

    window.open(absoluteUrl, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary_head text-white px-8 py-4 flex justify-between items-center">
        <h1>PDF Viewer and Editor</h1>
        <div className="flex items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            id="file-upload"
            className="hidden"
          />
        </div>
      </header>

      {message && (
        <div
          className={`px-4 py-4 mx-8 my-2 rounded ${
            message.includes("Error")
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-1">
        <div className="w-64 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto">
          <h2 className="mt-0 text-lg text-gray-800 mb-4">Your Files</h2>
          {isLoading && !files.length ? (
            <p>Loading files...</p>
          ) : files.length === 0 ? (
            <p>No files found. Upload a PDF to get started.</p>
          ) : (
            <ul className="list-none p-0 m-0">
              {files.map((file) => (
                <li
                  key={file.fileId}
                  className={`p-3 rounded cursor-pointer mb-2 border border-gray-300 flex flex-col transition-colors ${
                    selectedFile && selectedFile.fileId === file.fileId
                      ? "bg-blue-50 border-blue-300"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleFileSelect(file.fileId)}
                >
                  <span className="font-medium mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {file.fileName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {pdfUrl ? (
            <div className="flex flex-1 p-4 gap-4">
              <div className="flex-1 bg-white rounded-lg shadow-md p-4 flex flex-col min-h-[calc(100vh-200px)] overflow-hidden">
                <h2>Original PDF</h2>
                <PDFViewer pdfUrl={pdfUrl} />
              </div>
              <div className="flex-1 bg-white rounded-lg shadow-md p-4 flex flex-col min-h-[calc(100vh-200px)] overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <h2>Telugu Translation</h2>
                  {teluguPdfUrl && (
                    <button
                      onClick={() => testPdfUrl(teluguPdfUrl)}
                      className="text-primary_head hover:text-primary_head-hover text-sm"
                    >
                      Test Telugu PDF URL
                    </button>
                  )}
                </div>
                {teluguPdfUrl ? (
                  <PDFEditor
                    pdfUrl={teluguPdfUrl}
                    onSave={handleSavePdf}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Telugu PDF translation not available
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center text-gray-500 text-lg p-8 text-center">
              <p>
                Select a file from the sidebar or upload a new PDF to begin
                editing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFEditorDashboard;
