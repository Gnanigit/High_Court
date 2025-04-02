import React, { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import FileUpload from "@/components/FileUpload";
import TranslationDisplay from "@/components/TranslationDisplay";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { getLanguageByCode } from "@/utils/languages";
import {
  extractTextFromImage,
  translateText,
  TranslationResult,
} from "@/utils/translate";

import axios from "axios";

const sendApprovalEmails = async (translationData: any, fileName: string) => {
  const approvers = [
    { email: "gnani4412@gmail.com", name: "Approver 1" },
    { email: "21pa1a0553@vishnu.edu.in", name: "Approver 2" },
    { email: "21pa1a0552@vishnu.edu.in", name: "Approver 3" },
  ];

  try {
    const response = await axios.post("/api/send-approval-emails", {
      approvers,
      translationData,
      fileName,
      subject: `Approval Request: Translation of ${fileName}`,
      message: `A new document translation requires your approval. The document "${fileName}" has been translated and needs your review.`,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending approval emails:", error);
    throw error;
  }
};

const TranslateSingle = () => {
  type DriveFile = {
    id: string;
    name: string;
    url: string;
    mimeType: string;
    webViewLink?: string;
    webContentLink?: string;
  };

  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("tel");
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | DriveFile | null>(
    null
  );

  const handleFileSelected = (file: File | DriveFile | null) => {
    setSelectedFile(file);
    setTranslationResult(null);
  };

  const handleSourceLanguageChange = (value: string) => {
    setSourceLanguage(value);
    setTranslationResult(null);
  };

  const handleTargetLanguageChange = (value: string) => {
    setTargetLanguage(value);
    setTranslationResult(null);
  };

  const handleTranslate = async () => {
    if (!selectedFile) {
      toast.error("No file selected", {
        description: "Please upload an image to translate",
      });
      return;
    }

    if (!(selectedFile instanceof File)) {
      toast.error("Invalid file type", {
        description: "Please upload a valid image file",
      });
      return;
    }

    try {
      setIsLoading(true);
      setTranslationResult(null);

      const extractedText = await extractTextFromImage(selectedFile);
      const result = await translateText(
        extractedText,
        sourceLanguage,
        targetLanguage
      );

      setTranslationResult(result);
      const sourceLanguageFull = result
        ? getLanguageByCode(sourceLanguage).name
        : "Source";
      const targetLanguageFull = result
        ? getLanguageByCode(targetLanguage).name
        : "Target";

      toast.success("Translation complete", {
        description: `Translated from ${sourceLanguageFull} (${sourceLanguage}) to ${targetLanguageFull} (${targetLanguage})`,
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed", {
        description: "An error occurred during translation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!translationResult || !selectedFile) return;

    try {
      setIsSaving(true);

      // Implement save functionality here (e.g., saving to database)
      // This is a placeholder for the actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Translation saved", {
        description: "Your translation has been saved successfully",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Save failed", {
        description: "An error occurred while saving the translation",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndSubmit = async () => {
    if (!translationResult || !selectedFile) return;

    try {
      setIsSubmitting(true);

      // First save the translation
      // Implement save functionality here (e.g., saving to database)
      // This is a placeholder for the actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Prepare data for approval emails
      const fileName =
        selectedFile instanceof File ? selectedFile.name : "document";
      const translationData = {
        sourceLanguage: getLanguageByCode(sourceLanguage).name,
        targetLanguage: getLanguageByCode(targetLanguage).name,
        sourceText: translationResult.originalText,
        translatedText: translationResult.translatedText,
        translationId: Date.now().toString(), // Generate a unique ID (use a proper UUID in production)
      };

      // Send approval emails
      await sendApprovalEmails(translationData, fileName);

      toast.success("Translation saved and submitted for approval", {
        description: "Approval requests have been sent to reviewers",
      });
    } catch (error) {
      console.error("Save and submit error:", error);
      toast.error("Save and submit failed", {
        description: "An error occurred during the process",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-lg max-w-2xl animate-slide-up delay-75">
            Upload a{" "}
            <span className="text-primary_head font-bold">single PDF</span>{" "}
            containing text, select the languages, and instantly translate the
            content.
          </p>
        </div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="w-full">
            <h2 className="text-xl font-medium mb-4">Select Languages</h2>
            <LanguageSelector
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              onSourceLanguageChange={handleSourceLanguageChange}
              onTargetLanguageChange={handleTargetLanguageChange}
              disabled={isLoading || isSaving || isSubmitting}
            />
          </div>

          <Separator />

          <div className="w-full">
            <h2 className="text-xl font-medium mb-4">Upload Document</h2>
            <FileUpload
              type="single"
              onFileSelected={handleFileSelected}
              selectedFile={selectedFile}
              disabled={isLoading || isSaving || isSubmitting}
            />
          </div>

          <div className="w-full flex justify-center">
            <Button
              onClick={handleTranslate}
              disabled={!selectedFile || isLoading || isSaving || isSubmitting}
              className="w-full sm:w-auto px-8 transition-all bg-primary_head/50 hover:bg-primary_head"
            >
              {isLoading ? "Translating..." : "Translate Now"}
            </Button>
          </div>

          {(translationResult || isLoading) && (
            <>
              <Separator className="my-8" />
              <TranslationDisplay
                result={translationResult}
                isLoading={isLoading}
              />

              {translationResult && !isLoading && (
                <div className="w-full flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || isSubmitting}
                    className="w-full sm:w-auto px-8 bg-secondary hover:bg-secondary/80"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={handleSaveAndSubmit}
                    disabled={isSaving || isSubmitting}
                    className="w-full sm:w-auto px-8 bg-primary_head hover:bg-primary_head/90"
                  >
                    {isSubmitting ? "Submitting..." : "Save and Submit"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TranslateSingle;
