// src/pages/Approve.tsx
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

// In a real application, you would fetch this data from your backend
const fetchTranslationData = async (id: string) => {
  try {
    // This is a mock implementation
    // In a real app, you would fetch from your API/database
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          fileName: "Example Document.pdf",
          sourceLanguage: "English",
          targetLanguage: "Telugu",
          sourceText:
            "This is an example source text that would be much longer in a real scenario. It demonstrates how the approval page would display the content that needs review.",
          translatedText:
            "ఇది ఒక ఉదాహరణ మూల పాఠ్యం, ఇది నిజమైన సన్నివేశంలో చాలా పొడవుగా ఉంటుంది. సమీక్ష అవసరమైన విషయాలను అనుమతి పేజీ ఎలా ప్రదర్శిస్తుందో ఇది చూపిస్తుంది.",
          status: "pending",
        });
      }, 1000);
    });

    // Real implementation would be something like:
    // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/translations/${id}`);
    // return response.data;
  } catch (error) {
    console.error("Error fetching translation:", error);
    throw error;
  }
};

const ApprovePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const reviewer = searchParams.get("reviewer");
  const navigate = useNavigate();

  const [translationData, setTranslationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Fetch translation data
      fetchTranslationData(id)
        .then((data) => {
          setTranslationData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching translation:", error);
          toast.error("Error loading translation data");
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, make an API call to approve the translation
      // e.g., await axios.post(`${import.meta.env.VITE_API_URL}/api/translations/${id}/approve`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Translation approved successfully", {
        description: "Thank you for your review",
      });

      // Redirect to a confirmation page after short delay
      setTimeout(() => {
        navigate("/approval-confirmation?status=approved");
      }, 2000);
    } catch (error) {
      console.error("Error approving translation:", error);
      toast.error("Failed to submit approval");
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
      // In a real app, make an API call to reject the translation
      // e.g., await axios.post(`${import.meta.env.VITE_API_URL}/api/translations/${id}/reject`, { comments });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Feedback submitted successfully", {
        description: "The translation will be revised based on your feedback",
      });

      // Redirect to a confirmation page after short delay
      setTimeout(() => {
        navigate("/approval-confirmation?status=rejected");
      }, 2000);
    } catch (error) {
      console.error("Error rejecting translation:", error);
      toast.error("Failed to submit feedback");
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
              <div>
                <p className="font-medium">Document Name</p>
                <p className="text-muted-foreground">
                  {translationData.fileName}
                </p>
              </div>
              <div>
                <p className="font-medium">Translation ID</p>
                <p className="text-muted-foreground">{translationData.id}</p>
              </div>
              <div>
                <p className="font-medium">Source Language</p>
                <p className="text-muted-foreground">
                  {translationData.sourceLanguage}
                </p>
              </div>
              <div>
                <p className="font-medium">Target Language</p>
                <p className="text-muted-foreground">
                  {translationData.targetLanguage}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Original Text</h3>
              <div className="bg-secondary/10 p-4 rounded-md whitespace-pre-wrap">
                {translationData.sourceText}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Translated Text</h3>
              <div className="bg-secondary/10 p-4 rounded-md whitespace-pre-wrap">
                {translationData.translatedText}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">
                Comments (required if rejecting)
              </h3>
              <textarea
                className="w-full p-3 border rounded-md h-32 bg-background"
                placeholder="Enter your comments or feedback here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 bg-secondary/10 p-6">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Reject Translation"}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-primary_head hover:bg-primary_head/90"
            >
              {isSubmitting ? "Submitting..." : "Approve Translation"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ApprovePage;
