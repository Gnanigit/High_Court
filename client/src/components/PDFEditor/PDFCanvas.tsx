import { useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { Canvas, IText } from "fabric";
import { toast } from "sonner";

// Set the worker source for PDF.js with a specific version that's available on CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

interface PDFCanvasProps {
  pdfFile: File;
  currentPage: number;
  onTotalPagesChange: (pages: number) => void;
  currentTool: "select" | "text" | "eraser";
}

export const PDFCanvas = ({
  pdfFile,
  currentPage,
  onTotalPagesChange,
  currentTool,
}: PDFCanvasProps) => {
  // Rest of your component code remains the same...
  // (Copy all the code from your original component, just remove the CSS imports)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [pdfData, setPdfData] = useState<string | ArrayBuffer | null>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  // Load the PDF file
  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        setPdfData(e.target.result);
        setLoadError(null);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading PDF file:", error);
      setLoadError(new Error("Failed to read the PDF file"));
      toast.error("Failed to load the PDF file");
    };

    try {
      reader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      console.error("Error reading PDF file:", error);
      setLoadError(
        error instanceof Error ? error : new Error("Unknown error loading PDF")
      );
      toast.error("Failed to load the PDF file");
    }
  }, [pdfFile]);

  // Initialize the Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    const canvas = new Canvas(canvasRef.current, {
      width: containerRef.current?.clientWidth || 800,
      height: 1000, // Initial height, will be updated
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);
    setIsCanvasReady(true);

    return () => {
      canvas.dispose();
    };
  }, [fabricCanvas]);

  // Handle tool changes
  useEffect(() => {
    if (!fabricCanvas) return;

    // Set selection mode
    fabricCanvas.selection = currentTool === "select";

    // Update cursor based on current tool
    if (currentTool === "text") {
      fabricCanvas.defaultCursor = "text";
      fabricCanvas.hoverCursor = "text";
    } else if (currentTool === "eraser") {
      fabricCanvas.defaultCursor = "not-allowed";
      fabricCanvas.hoverCursor = "not-allowed";
    } else {
      fabricCanvas.defaultCursor = "default";
      fabricCanvas.hoverCursor = "move";
    }

    const handleCanvasClick = (e: MouseEvent) => {
      if (!fabricCanvas) return;

      if (currentTool === "text") {
        const pointer = fabricCanvas.getPointer(e);
        const text = new IText("Edit this text", {
          left: pointer.x,
          top: pointer.y,
          fontSize: 20,
          fill: "#000000",
          fontFamily: "Arial",
          editable: true,
        });

        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        text.set({ editable: true });
        // IText handles editing automatically when clicked
      } else if (currentTool === "eraser") {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject) {
          fabricCanvas.remove(activeObject);
          toast.success("Object removed!");
        }
      }
    };

    fabricCanvas.on("mouse:down", handleCanvasClick as any);

    return () => {
      fabricCanvas.off("mouse:down", handleCanvasClick as any);
    };
  }, [currentTool, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas || !pageWidth || !pageHeight) return;

    fabricCanvas.setWidth(pageWidth);
    fabricCanvas.setHeight(pageHeight);
    fabricCanvas.renderAll();
  }, [fabricCanvas, pageWidth, pageHeight]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    onTotalPagesChange(numPages);
    toast.success(`PDF loaded with ${numPages} pages`);
  };

  const handlePageLoadSuccess = (page: any) => {
    try {
      if (page && page._page && typeof page._page.getViewport === "function") {
        const viewport = page._page.getViewport({ scale: 1 });
        const containerWidth = containerRef.current?.clientWidth || 800;
        const scale = containerWidth / viewport.width;

        setPageWidth(viewport.width * scale);
        setPageHeight(viewport.height * scale);
      } else {
        console.warn("Page viewport not available, using fallback dimensions");
        const containerWidth = containerRef.current?.clientWidth || 800;

        setPageWidth(containerWidth);
        setPageHeight(containerWidth * 1.414); // Standard A4 ratio
      }
    } catch (error) {
      console.error("Error in handlePageLoadSuccess:", error);

      const containerWidth = containerRef.current?.clientWidth || 800;
      setPageWidth(containerWidth);
      setPageHeight(containerWidth * 1.414); // Standard A4 ratio
    }
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF document:", error);
    setLoadError(error);
    toast.error("Failed to load the PDF document: " + error.message);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center p-4 bg-gray-100 min-h-[600px]"
    >
      {pdfData && (
        <div
          style={{
            position: "relative",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "white",
            width: pageWidth || "100%",
            minHeight: "500px",
          }}
        >
          <Document
            file={pdfData}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            loading={
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                <span className="ml-2">Loading PDF...</span>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center text-red-500 py-10">
                <p className="font-medium">Error loading PDF!</p>
                <p className="text-sm mt-2">
                  {loadError
                    ? loadError.message
                    : "Failed to load the document"}
                </p>
              </div>
            }
          >
            {!loadError && (
              <Page
                pageNumber={currentPage}
                width={pageWidth || undefined}
                onLoadSuccess={handlePageLoadSuccess}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                    <span className="ml-2">Loading page...</span>
                  </div>
                }
              />
            )}
          </Document>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: isCanvasReady ? "auto" : "none",
            }}
          >
            <canvas ref={canvasRef} />
          </div>
        </div>
      )}
    </div>
  );
};
