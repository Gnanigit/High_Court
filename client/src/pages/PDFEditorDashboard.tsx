import React, { useState, useEffect } from "react";
import PDFViewer from "../components/PDFViewer";
import PDFEditor from "../components/PDFEditor";

const PDFEditorDashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all files when component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://high-court.onrender.com/api/files");
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage("Error fetching files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (fileId) => {
    setIsLoading(true);
    setMessage("");

    try {
      // Find the file in our state
      const file = files.find((f) => f.fileId === fileId);
      if (file) {
        setSelectedFile(file);

        // Generate a preview URL for the selected file
        const previewUrl = `http://high-court.onrender.com/api/files/preview/${fileId}`;
        setPdfUrl(previewUrl);
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
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("pdfFile", editedPdfBlob, selectedFile.fileName);

      if (selectedFile && selectedFile.fileId) {
        formData.append("originalFileId", selectedFile.fileId);
      }

      // Send the edited PDF to the server
      const response = await fetch(
        "http://high-court.onrender.com/api/files/save-edited",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save PDF");
      }

      const data = await response.json();
      if (data.success) {
        setMessage("PDF saved successfully!");
        // Refresh the file list
        fetchFiles();
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error saving PDF:", error);
      setMessage(`Error saving PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      setMessage("Please select a valid PDF file.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("pdfFile", file);
      formData.append("fileName", file.name);

      const response = await fetch(
        "http://high-court.onrender.com/api/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      if (data.success) {
        setMessage("File uploaded successfully!");
        fetchFiles();
        // Automatically select the newly uploaded file
        handleFileSelect(data.fileId);
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage(`Error uploading file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white px-8 py-4 flex justify-between items-center">
        <h1>PDF Viewer and Editor</h1>
        <div className="flex items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            id="file-upload"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer text-base inline-block"
          >
            Upload New PDF
          </label>
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
                <h2>Editable PDF</h2>
                <PDFEditor
                  pdfUrl={pdfUrl}
                  onSave={handleSavePdf}
                  isLoading={isLoading}
                />
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
