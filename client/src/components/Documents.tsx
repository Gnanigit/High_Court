import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFiles, setLoading, setError } from "../store/slices/fileSlice";
import { getAllFiles, getFileById } from "../api/file";
import DocumentCard from "./DocumentCard";
import DocumentViewer from "../pages/DocumentViewer";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, FileText } from "lucide-react";

interface Document {
  _id: string;
  fileName: string;
  fileId: string;
  sourceLanguage?: string;
  translatedLanguage?: string;
  translated: boolean;
  approvals: {
    approval_1: boolean;
    approval_2: boolean;
    approval_3?: boolean;
  };
  pdfFile?: Buffer | Buffer<ArrayBufferLike>;
  pdfMimeType?: string;
  createdAt: string;
  updatedAt: string;
}

const Documents: React.FC = () => {
  const dispatch = useAppDispatch();
  const { files, loading, error } = useAppSelector((state) => state.files);
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [viewerLoading, setViewerLoading] = useState(false);

  const fetchDocuments = async () => {
    dispatch(setLoading(true));
    try {
      const data = await getAllFiles();
      console.log(data[0]);
      dispatch(setFiles(data));
      dispatch(setError(null));
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Failed to fetch documents";
      dispatch(setError(errorMessage));
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleViewDocument = async (documentId: string) => {
    setViewerLoading(true);
    try {
      const documentDetails = await getFileById(documentId);
      console.log(documentDetails);
      if (documentDetails.success) {
        // Transform the flat approval properties into the required approvals object
        setSelectedDocument({
          ...documentDetails,
          approvals: {
            approval_1: documentDetails.approvals.approval_1,
            approval_2: documentDetails.approvals.approval_2,
            approval_3: documentDetails.approvals.approval_3,
          },
          pdfFile: documentDetails.pdfFile,
          pdfMimeType: documentDetails.pdfMimeType || "application/pdf",
        });
      } else {
        throw new Error(documentDetails.message || "Failed to load document");
      }
    } catch (error) {
      console.error("View document error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load document details",
        variant: "destructive",
      });
    } finally {
      setViewerLoading(false);
    }
  };

  const handleCloseViewer = () => {
    setSelectedDocument(null);
  };

  const handleUploadNew = () => {
    console.log("Upload new document");
  };

  if (selectedDocument) {
    return (
      <DocumentViewer
        document={{
          ...selectedDocument,
          pdfFile: selectedDocument.pdfFile || undefined,
          pdfMimeType: selectedDocument.pdfMimeType || "application/pdf",
        }}
        onBack={handleCloseViewer}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDocuments}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button size="sm" onClick={handleUploadNew}>
            <Plus size={16} className="mr-2" />
            Upload New
          </Button>
        </div>
      </div>

      {(loading || viewerLoading) && (
        <div className="w-full flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin text-primary_head" />
            <p className="text-gray-600">
              {viewerLoading
                ? "Loading document details..."
                : "Loading documents..."}
            </p>
          </div>
        </div>
      )}

      {error && !loading && !viewerLoading && (
        <div className="w-full bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !viewerLoading && !error && files.length === 0 && (
        <div className="w-full bg-gray-50 border border-gray-200 rounded-md p-12 flex flex-col items-center justify-center text-center">
          <FileText size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            No documents found
          </h3>
          <p className="text-gray-500 mt-2 mb-4">
            Upload your first document to get started with translations
          </p>
          <Button onClick={handleUploadNew}>
            <Plus size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>
      )}

      {!loading && !viewerLoading && !error && files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <DocumentCard
              key={file.fileId}
              fileName={file.fileName}
              sourceLanguage={file.sourceLanguage}
              translatedLanguage={file.translatedLanguage}
              translated={file.translated}
              approval_1={file.approvals.approval_1}
              approval_2={file.approvals.approval_2}
              approval_3={file.approvals.approval_3}
              onView={() => handleViewDocument(file.fileId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
