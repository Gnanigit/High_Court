import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Check,
  X,
  Calendar,
  Globe,
  ArrowLeftRight,
  Clock,
  ChevronLeft,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Updated interface to include approvals as a nested object
interface DocumentViewProps {
  document: {
    _id: string;
    fileName: string;
    sourceLanguage?: string;
    translatedLanguage?: string;
    translated: boolean;
    approvals: {
      approval_1: boolean;
      approval_2: boolean;
      approval_3?: boolean;
    };
    pdfFile: Buffer;
    pdfMimeType: string;
    createdAt: string;
    updatedAt: string;
  };
  onBack: () => void;
}

const DocumentViewer: React.FC<DocumentViewProps> = ({ document, onBack }) => {
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);
  const [translatedFileUrl, setTranslatedFileUrl] = useState<string | null>(
    null
  );

  const arrayBufferToBase64 = (buffer: Buffer | ArrayBuffer) => {
    if (typeof window === "undefined") {
      return Buffer.from(buffer).toString("base64");
    } else {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  };

  // Handle PDF data conversion safely
  const pdfDataUrl = document.pdfFile
    ? `data:${document.pdfMimeType};base64,${
        typeof document.pdfFile === "string"
          ? document.pdfFile
          : arrayBufferToBase64(document.pdfFile)
      }`
    : "";

  useEffect(() => {
    // Set the original file URL
    setOriginalFileUrl(pdfDataUrl);

    // Generate the translated file URL
    if (document.fileName) {
      const dashIndex = document.fileName.indexOf("-");
      const baseName =
        dashIndex !== -1
          ? document.fileName.substring(0, dashIndex)
          : document.fileName;

      const translatedFilePath = `/QIT_Model/${baseName}-Telugu.pdf`;
      setTranslatedFileUrl(translatedFilePath);
    }
  }, [document.fileName, pdfDataUrl]);

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Document Details</h1>
      </div>

      {/* Document Info Card - Now on top */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">File Name</h3>
            <p className="text-gray-700 break-words">{document.fileName}</p>
          </div>

          {(document.sourceLanguage || document.translatedLanguage) && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Source</span>
                </div>
                <p className="font-medium mt-1">
                  {document.sourceLanguage || "N/A"}
                </p>
              </div>

              <ArrowLeftRight className="h-4 w-4 text-gray-400" />

              <div className="flex-1">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Target</span>
                </div>
                <p className="font-medium mt-1">
                  {document.translatedLanguage || "Telugu"}
                </p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatusItem label="Translated" status={document.translated} />
              <StatusItem
                label="Review 1"
                status={document.approvals.approval_1}
              />
              <StatusItem
                label="Review 2"
                status={document.approvals.approval_2}
              />
              <StatusItem
                label="Review 3"
                status={document.approvals.approval_3 || false}
              />
            </div>
          </div>

          {/* Dates and Download in a single row */}
          <div className="border-t pt-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex space-x-6">
                <div>
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Created</span>
                  </div>
                  <p className="font-medium">
                    <strong>{formatDate(document.createdAt)}</strong>
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Last Updated</span>
                  </div>
                  <p className="font-medium">
                    <strong>{formatDate(document.updatedAt)}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-0">
                <Button className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  <strong>Download Document</strong>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Previews - Side by Side with increased height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Document Preview */}
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-gray-50">
            <CardTitle>Original Document</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            {originalFileUrl ? (
              <div className="h-120 w-full border rounded-md overflow-hidden">
                <iframe
                  src={originalFileUrl}
                  className="w-full h-full"
                  title={document.fileName}
                  style={{ height: "700px" }}
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center h-full bg-gray-50 border rounded-md"
                style={{ height: "600px" }}
              >
                <p className="text-gray-500">
                  Original PDF preview unavailable
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Original
            </Button>
          </CardFooter>
        </Card>

        {/* Telugu Document Preview */}
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-gray-50">
            <CardTitle>Telugu Document</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            {translatedFileUrl ? (
              <div className="h-120 w-full border rounded-md overflow-hidden">
                <iframe
                  src={translatedFileUrl}
                  className="w-full h-full"
                  title="Telugu Document"
                  style={{ height: "700px" }}
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center h-full bg-gray-50 border rounded-md"
                style={{ height: "600px" }}
              >
                <p className="text-gray-500">Telugu PDF preview unavailable</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Telugu Version
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* File Information */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle>File Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">File Type</h3>
              <p>{document.pdfMimeType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Document ID</h3>
              <p className="font-mono text-sm">{document._id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">File Size</h3>
              <p>{formatFileSize(document.pdfFile.length)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for status items
const StatusItem: React.FC<{ label: string; status: boolean }> = ({
  label,
  status,
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <span className="text-sm">{label}</span>
      {status ? (
        <Badge variant="default" className="bg-green-500">
          <Check className="h-3 w-3 mr-1" /> Done
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-500 border-gray-300">
          <X className="h-3 w-3 mr-1" /> Pending
        </Badge>
      )}
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default DocumentViewer;
