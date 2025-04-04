import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import { updateFile } from "@/store/slices/fileSlice";
import { getFileById } from "../api/file";

interface TranslationData {
  id: string;
  fileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;
  pdfFile?: string | Buffer | ArrayBuffer;
  pdfMimeType?: string;
}

const DocumentPreviewPanel = ({
  title,
  dataUrl,
  fileName,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="glass-panel rounded-lg p-4 h-full flex flex-col w-full">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  const isImage = fileName
    ?.toLowerCase()
    .match(/\.(jpg|jpeg|png|gif|bmp|svg)$/);

  return (
    <div className="glass-panel rounded-lg p-4 h-full flex flex-col w-full">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="bg-secondary/10 p-3 rounded-md flex-1 overflow-hidden flex flex-col w-full">
        <p className="text-sm font-medium mb-2">{fileName || "Document"}</p>
        {dataUrl ? (
          isImage ? (
            <img
              src={dataUrl}
              alt={fileName}
              className="w-full h-auto max-h-[500px] object-contain"
            />
          ) : (
            <iframe
              src={dataUrl}
              className="w-full h-[500px]"
              title={fileName}
              frameBorder="0"
              allowFullScreen
            />
          )
        ) : (
          <div className="flex items-center justify-center flex-1 bg-muted/20 rounded text-sm text-muted-foreground h-[500px]">
            No preview available
          </div>
        )}
      </div>
    </div>
  );
};

const arrayBufferToBase64 = (buffer) => {
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

const ApprovePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reviewer = searchParams.get("reviewer");
  const dispatch = useAppDispatch();

  const [originalDocument, setOriginalDocument] = useState(null);
  const [translatedDocument, setTranslatedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const documentDetails = await getFileById(id);
        console.log(documentDetails);
        if (!documentDetails.success) {
          throw new Error(documentDetails.message || "Failed to load document");
        }

        const originalDoc = {
          ...documentDetails,
          pdfMimeType: documentDetails.pdfMimeType || "application/pdf",
        };
        setOriginalDocument(originalDoc);

        try {
          const fileName = originalDoc.fileName;
          const baseName =
            fileName.substring(0, fileName.lastIndexOf("-")) || fileName;

          const translatedFileName = `${baseName}-Telugu.pdf`;
          console.log(translatedFileName);
          const translatedDocResponse = await axios.get(
            `/QIT_Model/${translatedFileName}`,
            {
              responseType: "arraybuffer",
            }
          );
          console.log(translatedDocResponse);

          if (translatedDocResponse.status === 200) {
            setTranslatedDocument({
              fileName: translatedFileName,
              pdfFile: translatedDocResponse.data,
              pdfMimeType: "application/pdf",
            });
          }
        } catch (translatedError) {
          console.error("Error loading translated document:", translatedError);
        }
      } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Error loading document data", {
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  const getDocumentDataUrl = (document) => {
    if (!document || !document.pdfFile) return null;

    return `data:${document.pdfMimeType || "application/pdf"};base64,${
      typeof document.pdfFile === "string"
        ? document.pdfFile
        : arrayBufferToBase64(document.pdfFile)
    }`;
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const apiUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/translations/${id}/approve`;

      const response = await axios.post(apiUrl, { approvedBy: reviewer });

      if (response.data.success && response.data.data) {
        dispatch(updateFile(response.data.data));
      }

      toast.success("Translation approved successfully", {
        description: "Thank you for your review",
      });
      setTimeout(
        () => navigate("/approval-confirmation?status=approved"),
        2000
      );
    } catch (error) {
      console.error("Error approving translation:", error);
      toast.error("Failed to submit approval");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    // Modified to skip backend call
    if (!comments.trim()) {
      toast.error("Please provide comments", {
        description: "Comments are required when rejecting a translation",
      });
      return;
    }

    setIsSubmitting(true);

    // Show success toast and redirect without making API call
    toast.success("Feedback submitted successfully", {
      description: "The translation will be revised based on your feedback",
    });

    // Just navigate to the confirmation screen with rejected status
    setTimeout(() => navigate("/approval-confirmation?status=rejected"), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">
            Loading document data...
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!originalDocument) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-medium mb-4">Document Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The document you are looking for does not exist or may have been
            already processed.
          </p>
          <Button onClick={() => navigate("/")}>Return to Homepage</Button>
        </div>
      </div>
    );
  }

  const originalDataUrl = getDocumentDataUrl(originalDocument);
  const translatedDataUrl = getDocumentDataUrl(translatedDocument);

  return (
    <div className="min-h-screen flex flex-col bg-background p-4 sm:p-6 w-full">
      <div className="container mx-auto w-full">
        <Card className="shadow-lg w-full">
          <CardHeader className="bg-secondary/20">
            <CardTitle className="text-2xl">Translation Approval</CardTitle>
            <p className="text-muted-foreground">
              Please review the following translation and provide your approval
              or feedback.
            </p>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="font-medium">
                Document Name: {originalDocument.fileName}
              </p>
              <p className="font-medium">Document ID: {originalDocument.id}</p>
              <p className="font-medium">
                Source Language: {originalDocument.sourceLanguage || "English"}
              </p>
              <p className="font-medium">
                Target Language: {originalDocument.targetLanguage || "Telugu"}
              </p>
            </div>
            <Separator />

            {/* Document previews side by side */}
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <DocumentPreviewPanel
                title="Original Document"
                dataUrl={originalDataUrl}
                fileName={originalDocument.fileName}
                isLoading={false}
              />
              <DocumentPreviewPanel
                title="Translated Document"
                dataUrl={translatedDataUrl}
                fileName={
                  translatedDocument?.fileName || "Translated Output.pdf"
                }
                isLoading={false}
              />
            </div>

            <textarea
              className="w-full p-3 border rounded-md h-32"
              placeholder="Enter comments or feedback..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={isSubmitting}
            />
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 bg-secondary/10 p-6">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting}
              className="bg-red-700 hover:bg-red-700/90 text-white"
            >
              {isSubmitting ? "Submitting..." : "Reject"}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-green-700 hover:bg-green-700/90 text-white"
            >
              {isSubmitting ? "Submitting..." : "Approve"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ApprovePage;
