import React, { useEffect, useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";

// Set the PDF.js worker source
// pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function PDFEditor({ pdfUrl, onSave, isLoading }) {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentMode, setCurrentMode] = useState("text");
  const [scale, setScale] = useState(1);
  const [pageRendering, setPageRendering] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    console.log("Initializing fabric canvas");
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: 800,
    });
    console.log("Fabric canvas initialized:", canvas);
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Load PDF document
  useEffect(() => {
    if (!pdfUrl || !fabricCanvas) return;

    const loadPdf = async () => {
      try {
        console.log("PDF loading started for URL:", pdfUrl);

        // Test if the URL is accessible
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch PDF: ${response.status} ${response.statusText}`
          );
        }

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);

        console.log("PDF loaded successfully:", doc);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();

    return () => {
      setPdfDoc(null);
      setTotalPages(0);
    };
  }, [pdfUrl, fabricCanvas]);

  // Render current page when it changes
  useEffect(() => {
    if (!pdfDoc || !fabricCanvas || !currentPage) return;
    renderPage(currentPage);
  }, [pdfDoc, currentPage, fabricCanvas]);

  // Save canvas state to history when it changes
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleObjectAdded = () => {
      saveToHistory();
    };

    const handleObjectRemoved = () => {
      saveToHistory();
    };

    fabricCanvas.on("object:added", handleObjectAdded);
    fabricCanvas.on("object:removed", handleObjectRemoved);
    fabricCanvas.on("object:modified", handleObjectAdded);

    return () => {
      fabricCanvas.off("object:added", handleObjectAdded);
      fabricCanvas.off("object:removed", handleObjectRemoved);
      fabricCanvas.off("object:modified", handleObjectAdded);
    };
  }, [fabricCanvas, editHistory, historyIndex]);

  const saveToHistory = () => {
    if (!fabricCanvas) return;

    // Get current canvas state
    const json = fabricCanvas.toJSON();

    // If we're not at the end of history, truncate
    if (historyIndex < editHistory.length - 1) {
      setEditHistory((prev) => prev.slice(0, historyIndex + 1));
    }

    // Add to history
    setEditHistory((prev) => [...prev, json]);
    setHistoryIndex((prev) => prev + 1);
  };

  const undo = () => {
    if (historyIndex <= 0 || !fabricCanvas) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);

    // Load previous state
    fabricCanvas.loadFromJSON(
      editHistory[newIndex],
      fabricCanvas.renderAll.bind(fabricCanvas)
    );
  };

  const redo = () => {
    if (historyIndex >= editHistory.length - 1 || !fabricCanvas) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);

    // Load next state
    fabricCanvas.loadFromJSON(
      editHistory[newIndex],
      fabricCanvas.renderAll.bind(fabricCanvas)
    );
  };

  const renderPage = async (pageNum) => {
    if (!pdfDoc || !fabricCanvas) return;

    setPageRendering(true);
    console.log("Rendering page:", pageNum);

    try {
      const page = await pdfDoc.getPage(pageNum);
      setCurrentPage(pageNum);

      // Calculate scale to fit the container width
      const containerWidth = containerRef.current.clientWidth;
      const viewport = page.getViewport({ scale: 1 });
      const calculatedScale = containerWidth / viewport.width;
      setScale(calculatedScale);

      const scaledViewport = page.getViewport({ scale: calculatedScale });

      // Clear the fabric canvas
      fabricCanvas.clear();

      // Set canvas dimensions
      fabricCanvas.setWidth(scaledViewport.width);
      fabricCanvas.setHeight(scaledViewport.height);

      // Create a fabric.Image object backed by a canvas element
      const pdfCanvas = document.createElement("canvas");
      pdfCanvas.width = scaledViewport.width;
      pdfCanvas.height = scaledViewport.height;

      const renderContext = {
        canvasContext: pdfCanvas.getContext("2d"),
        viewport: scaledViewport,
      };

      // Render the PDF page to the canvas
      await page.render(renderContext).promise;

      // Convert the canvas to an image and add it to fabric canvas
      fabric.Image.fromURL(pdfCanvas.toDataURL(), (img) => {
        fabricCanvas.setBackgroundImage(
          img,
          fabricCanvas.renderAll.bind(fabricCanvas)
        );
        saveToHistory();
      });
    } catch (error) {
      console.error("Error rendering page:", error);
    } finally {
      setPageRendering(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage <= 1 || pageRendering) return;
    renderPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages || pageRendering) return;
    renderPage(currentPage + 1);
  };

  const handleModeChange = (mode) => {
    if (!fabricCanvas) return;

    setCurrentMode(mode);

    // Configure the fabric canvas based on the selected mode
    switch (mode) {
      case "text":
        fabricCanvas.isDrawingMode = false;
        break;
      case "draw":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "black";
        fabricCanvas.freeDrawingBrush.width = 2;
        break;
      case "highlight":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "rgba(255, 255, 0, 0.3)"; // Yellow highlight
        fabricCanvas.freeDrawingBrush.width = 20;
        break;
      case "erase":
        fabricCanvas.isDrawingMode = false;
        break;
      default:
        fabricCanvas.isDrawingMode = false;
    }
  };

  const handleAddText = () => {
    if (!fabricCanvas) return;

    const text = new fabric.IText("Add text here", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fontSize: 16,
      fill: "black",
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
  };

  const handleDeleteSelected = () => {
    if (!fabricCanvas) return;

    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length) {
      fabricCanvas.remove(...activeObjects);
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
    }
  };

  const handleSavePdf = async () => {
    if (!fabricCanvas || isLoading) return;

    try {
      // Use pdf-lib to create a new PDF document
      const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Get the current page as an image from fabric.js
      const dataUrl = fabricCanvas.toDataURL({
        format: "png",
        quality: 1,
      });

      // Remove the data URL prefix to get just the base64 data
      const base64Data = dataUrl.split(",")[1];

      // Create an image from the fabric canvas
      const editedPageImage = await pdfDoc.embedPng(base64Data);

      // Get the current page
      const page = pdfDoc.getPage(currentPage - 1);

      // Get page dimensions
      const { width, height } = page.getSize();

      // Draw the image onto the page, covering the entire page
      page.drawImage(editedPageImage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });

      // Save the PDF
      const editedPdfBytes = await pdfDoc.save();
      const editedPdfBlob = new Blob([editedPdfBytes], {
        type: "application/pdf",
      });

      // Call the onSave callback with the edited PDF blob
      onSave(editedPdfBlob);
    } catch (error) {
      console.error("Error saving edited PDF:", error);
      alert("Error saving PDF: " + error.message);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden" ref={containerRef}>
      <div className="flex items-center p-2 bg-gray-100 border-b border-gray-300">
        <div className="flex space-x-2">
          <button
            className={`p-2 rounded ${
              currentMode === "text"
                ? "bg-blue-500 text-white"
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
                ? "bg-blue-500 text-white"
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
                ? "bg-blue-500 text-white"
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
                ? "bg-blue-500 text-white"
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
            className={`px-3 py-1 text-sm rounded ${
              currentMode !== "text"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            onClick={handleAddText}
            disabled={currentMode !== "text"}
            title="Add Text"
          >
            Add Text
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${
              currentMode !== "erase"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            onClick={handleDeleteSelected}
            disabled={currentMode !== "erase"}
            title="Delete Selected"
          >
            Delete Selected
          </button>
        </div>

        <div className="flex ml-4 space-x-2">
          <button
            className={`p-2 rounded ${
              historyIndex <= 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            ↩️
          </button>
          <button
            className={`p-2 rounded ${
              historyIndex >= editHistory.length - 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            onClick={redo}
            disabled={historyIndex >= editHistory.length - 1}
            title="Redo"
          >
            ↪️
          </button>
        </div>

        <button
          className={`px-4 py-2 ml-auto rounded ${
            isLoading || pageRendering
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={handleSavePdf}
          disabled={isLoading || pageRendering}
        >
          {isLoading ? "Saving..." : "Save PDF"}
        </button>
      </div>

      <div className="flex-1 overflow-auto relative bg-gray-100 flex justify-center items-start p-4">
        <canvas
          ref={canvasRef}
          className="block mx-auto shadow-md bg-white"
          style={{ border: "1px solid red" }} // Add this to check visibility
        ></canvas>
      </div>

      <div className="flex justify-center items-center gap-4 mt-4 py-2">
        <button
          className={`px-4 py-2 rounded ${
            currentPage <= 1 || pageRendering
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || pageRendering}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded ${
            currentPage >= totalPages || pageRendering
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || pageRendering}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PDFEditor;
