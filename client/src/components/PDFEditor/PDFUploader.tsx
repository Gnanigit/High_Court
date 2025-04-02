import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PDFUploaderProps {
  onFileUpload: (file: File) => void;
}

export const PDFUploader = ({ onFileUpload }: PDFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size exceeds 10MB limit");
      return;
    }

    onFileUpload(file);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload your PDF</h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Drag and drop your PDF here, or click to browse
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Browse Files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="application/pdf"
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};
