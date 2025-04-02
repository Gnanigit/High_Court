import { useState } from "react";
import { PDFUploader } from "@/components/PDFEditor/PDFUploader";
import { PDFCanvas } from "./PDFCanvas";
import { Toolbar } from "@/components/PDFEditor/Toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const PDFEditor = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentTool, setCurrentTool] = useState<"select" | "text" | "eraser">(
    "select"
  );

  const handleFileUpload = (file: File) => {
    setPdfFile(file);
    toast.success("PDF uploaded successfully!");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTotalPagesChange = (pages: number) => {
    setTotalPages(pages);
  };

  const handleToolChange = (tool: "select" | "text" | "eraser") => {
    setCurrentTool(tool);
  };

  return (
    <div className="flex flex-col space-y-4">
      {!pdfFile ? (
        <PDFUploader onFileUpload={handleFileUpload} />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">{pdfFile.name}</h2>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <button
              onClick={() => setPdfFile(null)}
              className="px-3 py-2 text-sm font-medium text-red-700 hover:text-red-800"
            >
              Close PDF
            </button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Toolbar
                currentTool={currentTool}
                onToolChange={handleToolChange}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <div className="border-t">
                <PDFCanvas
                  pdfFile={pdfFile}
                  currentPage={currentPage}
                  onTotalPagesChange={handleTotalPagesChange}
                  currentTool={currentTool}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
