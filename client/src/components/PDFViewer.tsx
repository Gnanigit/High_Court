import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Set the PDF.js worker source
// pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function PDFViewer({ pdfUrl }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pdfUrl) return;
    setIsLoading(true);

    const loadPdf = async () => {
      try {
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading PDF:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      // Clean up
      setPdfDoc(null);
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !currentPage) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Calculate scale to fit the container width
        const containerWidth = containerRef.current.clientWidth;
        const viewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        // Set canvas dimensions to match the viewport
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // Render the PDF page
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error("Error rendering page:", error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage]);

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages) return;
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-64 w-full bg-gray-100">
          <div className="text-gray-600 text-lg">Loading PDF...</div>
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="w-full p-4 bg-gray-50 border-b border-gray-200"
          >
            <canvas ref={canvasRef} className="mx-auto shadow-md" />
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className={`px-4 py-2 rounded-md font-medium ${
                currentPage <= 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              }`}
            >
              Previous
            </button>

            <div className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className={`px-4 py-2 rounded-md font-medium ${
                currentPage >= totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PDFViewer;
