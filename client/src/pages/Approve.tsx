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
import axios from "axios";

interface TranslationData {
  id: string;
  fileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  status: string;
}

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

  const [translationData, setTranslationData] =
    useState<TranslationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchTranslationData(id)
        .then((data) => {
          setTranslationData(data);
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
      console.log(import.meta.env.VITE_API_URL);
      const apiUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/translations/${id}/approve`;
      console.log("API URL:", apiUrl);

      await axios.post(apiUrl);
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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/translations/${id}/reject`,
        { comments }
      );
      toast.success("Feedback submitted successfully", {
        description: "The translation will be revised based on your feedback",
      });
      setTimeout(
        () => navigate("/approval-confirmation?status=rejected"),
        2000
      );
    } catch (error) {
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

  return (
    <div className="min-h-screen flex flex-col bg-background p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl">
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
            <h3 className="text-lg font-medium">Original Text</h3>
            <p className="bg-secondary/10 p-4 rounded-md whitespace-pre-wrap">
              {translationData.sourceText}
            </p>
            <h3 className="text-lg font-medium">Translated Text</h3>
            <p className="bg-secondary/10 p-4 rounded-md whitespace-pre-wrap">
              {translationData.translatedText}
            </p>
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
