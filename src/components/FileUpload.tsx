import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface FileUploadProps {
  type: string;
  onFileSelected: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onFileSelected,
  selectedFile,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile]);

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Only images or PDFs are allowed",
      });
      return;
    }
    onFileSelected(file);
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelected(null);
    setPreviewUrl(null);
  };

  return (
    <div className="w-full animate-scale-in delay-150">
      {!selectedFile ? (
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
            accept="image/*,application/pdf"
            ref={fileInputRef}
            disabled={disabled}
          />
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="mb-3 p-3 rounded-full bg-primary_head/10">
              <Upload className="h-6 w-6 text-primary_head" />
            </div>
            {type === "single" ? (
              <h3 className="text-lg font-medium mb-1">Upload a single PDF</h3>
            ) : (
              <h3 className="text-lg font-medium mb-1">
                Upload multiple PDFs in a ZIP file
              </h3>
            )}
            {type === "single" ? (
              <p className="text-sm text-muted-foreground mb-3 max-w-xs">
                Drag and drop a PDF file, or click to select.t
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mb-3 max-w-xs">
                Drag and drop a Zip file, or click to select
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Supported format: PDF (Max 5MB for pdf)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative glass-panel rounded-lg overflow-hidden">
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-10 right-4 z-10 bg-primary_head"
            onClick={handleRemoveFile}
            disabled={disabled}
          >
            <X className="h-4 w-4 " />
          </Button>
          {selectedFile.type.startsWith("image/") ? (
            <img
              src={previewUrl!}
              alt="Preview"
              className="w-full h-auto max-h-[400px] object-contain p-4"
            />
          ) : (
            <iframe
              src={previewUrl!}
              className="w-full h-[500px]"
              title="PDF Preview"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
