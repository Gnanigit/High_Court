import React, { useState, useEffect } from "react";

function PDFEditor({ pdfUrl, onSave, isLoading }) {
  const [absolutePdfUrl, setAbsolutePdfUrl] = useState("");
  const [showEditMode, setShowEditMode] = useState(false);
  const [currentMode, setCurrentMode] = useState("text");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Create absolute URL for the PDF
  useEffect(() => {
    if (!pdfUrl) return;

    const url = pdfUrl.startsWith("http")
      ? pdfUrl
      : window.location.origin +
        (pdfUrl.startsWith("/") ? pdfUrl : `/${pdfUrl}`);

    setAbsolutePdfUrl(url);
  }, [pdfUrl]);

  const toggleEditMode = () => {
    setShowEditMode(!showEditMode);
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  const handleSavePdf = () => {
    if (isLoading) return;

    // Create a dummy blob to simulate saving
    const dummyBlob = new Blob(["PDF content"], { type: "application/pdf" });
    onSave(dummyBlob);
  };

  // Display loading or error state
  if (pdfLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <div className="text-xl">Loading PDF...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 max-w-lg">
          <p className="font-bold">Error Loading PDF</p>
          <p>{loadError}</p>
          <p className="mt-2 text-sm">Current URL: {pdfUrl}</p>
          <button
            className="mt-4  hover:bg-primary_head-hover text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setLoadError(null);
              setPdfLoading(true);
              // Try to reload using the full URL
              const absoluteUrl = pdfUrl.startsWith("http")
                ? pdfUrl
                : window.location.origin +
                  (pdfUrl.startsWith("/") ? pdfUrl : `/${pdfUrl}`);
              window.open(absoluteUrl, "_blank");
            }}
          >
            Open PDF URL in New Tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center p-2 bg-gray-100 border-b border-gray-300">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded text-xs ${
              !showEditMode
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                : "bg-primary_head text-white"
            }`}
            onClick={toggleEditMode}
          >
            {!showEditMode ? "Edit Mode" : "Preview Mode"}
          </button>
        </div>

        {showEditMode && (
          <>
            <div className="flex ml-4 space-x-2">
              <button
                className={`p-2 rounded ${
                  currentMode === "text"
                    ? "bg-primary_head text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleModeChange("text")}
                title="Text Mode"
              >
                <span className="text-base">T</span>
              </button>
              <button
                className={`p-2 rounded ${
                  currentMode === "draw"
                    ? "bg-primary_head text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleModeChange("draw")}
                title="Drawing Mode"
              >
                <span className="text-base">✏️</span>
              </button>
              <button
                className={`p-2 rounded ${
                  currentMode === "highlight"
                    ? "bg-primary_head text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleModeChange("highlight")}
                title="Highlight Mode"
              >
                <span className="text-base">🖌️</span>
              </button>
              <button
                className={`p-2 rounded ${
                  currentMode === "erase"
                    ? "bg-primary_head text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleModeChange("erase")}
                title="Select & Delete Mode"
              >
                <span className="text-base">🗑️</span>
              </button>
            </div>

            <div className="flex ml-4 space-x-2">
              <button
                className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                title="Add Text"
              >
                Add Text
              </button>
              <button
                className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                title="Delete Selected"
              >
                Delete Selected
              </button>
            </div>

            <div className="flex ml-4 space-x-2">
              <button
                className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                title="Undo"
              >
                ↩️
              </button>
              <button
                className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                title="Redo"
              >
                ↪️
              </button>
            </div>
          </>
        )}

        <button
          className={`px-3 py-1 ml-auto rounded text-xs ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-primary_head hover:bg-primary_head-hover text-white"
          }`}
          onClick={handleSavePdf}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save PDF"}
        </button>
      </div>

      <div className="flex-1 overflow-auto relative bg-gray-100 flex justify-center items-start p-4">
        <div className="bg-background/50 p-3 rounded-md flex-1 overflow-hidden flex flex-col w-full h-full">
          <p className="text-sm font-medium mb-2">
            {pdfUrl ? pdfUrl.split("/").pop() : "PDF Document"}
          </p>
          {absolutePdfUrl ? (
            <iframe
              src={absolutePdfUrl}
              className="w-full h-[700px]"
              title="PDF Document"
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center flex-1 bg-muted/20 rounded text-sm text-muted-foreground h-[700px]">
              No preview available
            </div>
          )}
        </div>
      </div>

      {showEditMode && (
        <div className="flex justify-center items-center gap-4 mt-4 py-2">
          <button className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs">
            Previous
          </button>
          <span className="text-xs">Page 1 of 1</span>
          <button className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PDFEditor;
