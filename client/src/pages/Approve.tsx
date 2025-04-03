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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateFile } from "@/store/slices/fileSlice";

interface TranslationData {
  id: string;
  fileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  status: string;
}

const DocumentPreviewPanel = ({
  title,
  fileUrl,
  fileName,
  isLoading = false,
}) => {
  const isImage = fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|svg)$/);

  return (
    <div className="glass-panel rounded-lg p-4 h-full flex flex-col w-full">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {isLoading ? (
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div className="bg-secondary/10 p-3 rounded-md flex-1 overflow-hidden flex flex-col w-full">
          <p className="text-sm font-medium mb-2">{fileName}</p>
          {fileUrl ? (
            isImage ? (
              <img
                src={fileUrl}
                alt={fileName}
                className="w-full h-auto max-h-[400px] object-contain"
              />
            ) : (
              <iframe
                src={fileUrl}
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
      )}
    </div>
  );
};

const fetchTranslationData = async (id: string): Promise<TranslationData> => {
  try {
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id,
          fileName: "Example Document.pdf",
          sourceLanguage: "English",
          targetLanguage: "Telugu",
          sourceText:
            "This is an example source text that would be much longer in a real scenario.",
          translatedText:
            "ఇది ఒక ఉదాహరణ మూల పాఠ్యం, ఇది నిజమైన సన్నివేశంలో చాలా పొడవుగా ఉంటుంది.",
          status: "pending",
        });
      }, 1000)
    );
  } catch (error) {
    console.error("Error fetching translation:", error);
    throw error;
  }
};

const ApprovePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reviewer = searchParams.get("reviewer");
  const dispatch = useAppDispatch();
  const [translationData, setTranslationData] =
    useState<TranslationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState("");
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);
  const [translatedFileUrl, setTranslatedFileUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchTranslationData(id)
        .then((data) => {
          setTranslationData(data);

          // Set file URLs for the document preview
          if (data.fileName) {
            // Get the base name for the original document
            const dashIndex = data.fileName.indexOf("-");
            const baseName =
              dashIndex !== -1
                ? data.fileName.substring(0, dashIndex)
                : data.fileName.replace(/\.[^/.]+$/, ""); // Remove extension if no dash

            // Construct file URLs
            // In a real scenario, these would be actual paths to your documents
            const originalPath = `/original/${data.fileName}`;
            const translatedPath = `/QIT_Model/${baseName}-QIT Output.pdf`;

            setOriginalFileUrl(originalPath);
            setTranslatedFileUrl(translatedPath);
          }
        })
        .catch(() => {
          toast.error("Error loading translation data");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const apiUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/translations/${id}/approve`;
      console.log(apiUrl, reviewer);

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

  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error("Please provide comments", {
        description: "Comments are required when rejecting a translation",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/translations/${id}/reject`,
        { comments, approvedBy: reviewer }
      );

      if (response.data.success && response.data.data) {
        dispatch(updateFile(response.data.data));
      }

      toast.success("Feedback submitted successfully", {
        description: "The translation will be revised based on your feedback",
      });
      setTimeout(
        () => navigate("/approval-confirmation?status=rejected"),
        2000
      );
    } catch (error) {
      console.error("Error rejecting translation:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">
            Loading translation data...
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!translationData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-medium mb-4">Translation Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The translation you are looking for does not exist or may have been
            already processed.
          </p>
          <Button onClick={() => navigate("/")}>Return to Homepage</Button>
        </div>
      </div>
    );
  }

  // Create file names for display
  const originalFileName = translationData.fileName;
  const dashIndex = originalFileName.indexOf("-");
  const baseName =
    dashIndex !== -1
      ? originalFileName.substring(0, dashIndex)
      : originalFileName.replace(/\.[^/.]+$/, "");
  const translatedFileName = `${baseName}-QIT Output.pdf`;

  return (
    <div className="min-h-screen flex flex-col bg-background p-4 sm:p-6">
      <div className="container mx-auto max-w-6xl">
        <Card className="shadow-lg">
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
                Document Name: {translationData.fileName}
              </p>
              <p className="font-medium">
                Translation ID: {translationData.id}
              </p>
              <p className="font-medium">
                Source Language: {translationData.sourceLanguage}
              </p>
              <p className="font-medium">
                Target Language: {translationData.targetLanguage}
              </p>
            </div>
            <Separator />

            {/* Document previews side by side */}
            <div className="flex flex-row gap-6 mb-6 w-full">
              <DocumentPreviewPanel
                title={`Original (${translationData.sourceLanguage})`}
                fileUrl={originalFileUrl}
                fileName={originalFileName}
                isLoading={false}
              />
              <DocumentPreviewPanel
                title={`Translated (${translationData.targetLanguage})`}
                fileUrl={translatedFileUrl}
                fileName={translatedFileName}
                isLoading={false}
              />
            </div>

            <textarea
              className="w-full p-3 border rounded-md h-32"
              placeholder="Enter comments..."
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
            >
              {isSubmitting ? "Submitting..." : "Reject"}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-primary_head hover:bg-primary_head/90"
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
