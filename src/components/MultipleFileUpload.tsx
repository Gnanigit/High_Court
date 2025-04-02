import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface MultipleFileUploadProps {
  type: string;
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  disabled?: boolean;
}

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  type,
  onFilesSelected,
  selectedFiles,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (files.length === 0) {
      toast.error("Invalid file type", {
        description: "Only PDFs are allowed",
      });
      return;
    }

    onFilesSelected(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );

      if (files.length === 0) {
        toast.error("Invalid file type", {
          description: "Only PDFs are allowed",
        });
        return;
      }

      onFilesSelected(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className="w-full animate-scale-in delay-150">
      {selectedFiles.length === 0 ? (
        <div
          className={`file-upload-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="file-upload-input"
            onChange={handleFileInputChange}
            accept="application/pdf"
            ref={fileInputRef}
            disabled={disabled}
            multiple
          />
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="mb-3 p-3 rounded-full bg-primary_head/10">
              <Upload className="h-6 w-6 text-primary_head" />
            </div>
            <h3 className="text-lg font-medium mb-1">Upload multiple PDFs</h3>
            <p className="text-sm text-muted-foreground mb-3 max-w-xs">
              Drag and drop multiple PDFs, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supported format: PDF (Max 5MB per file)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative flex items-center justify-between p-3 border rounded-lg bg-gray-100"
            >
              <span className="text-sm text-muted-foreground">{file.name}</span>
              <Button
                variant="destructive"
                size="icon"
                className="bg-primary_head"
                onClick={() => handleRemoveFile(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleFileUpload;
