import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import GoogleDrivePicker from "./GoogleDrivePicker";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

interface FileUploadProps {
  type: string;
  onFileSelected: (file: File | DriveFile | null) => void;
  selectedFile: File | DriveFile | null;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onFileSelected,
  selectedFile,
  disabled = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedFile) {
      if ("url" in selectedFile) {
        // Google Drive file - use the URL directly
        setPreviewUrl(selectedFile.url);
      } else {
        // Local file
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        toast.error("Invalid file type", {
          description: "Only images or PDFs are allowed",
        });
        return;
      }
      onFileSelected(file);
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelected(null);
    setPreviewUrl(null);
  };

  const isImage = () => {
    if (!selectedFile) return false;
    if ("type" in selectedFile) {
      return selectedFile.type.startsWith("image/");
    }
    if ("mimeType" in selectedFile) {
      return selectedFile.mimeType.startsWith("image/");
    }
    return false;
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <>
          <div className="file-upload-area">
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
              <h3 className="text-lg font-medium mb-1">
                Upload an image or PDF
              </h3>
              <p className="text-sm text-muted-foreground mb-3 max-w-xs">
                Drag and drop a file, or click to select.
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <GoogleDrivePicker onFileSelected={onFileSelected} />
          </div>
        </>
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
          {previewUrl &&
            (isImage() ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto max-h-[400px] object-contain p-4"
              />
            ) : (
              <iframe
                src={previewUrl}
                className="w-full h-[700px]"
                title="PDF Preview"
                frameBorder="0"
                allowFullScreen
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
