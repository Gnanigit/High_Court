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
import { sendMails, uploadPdfFile, changeTranslateStatus } from "@/api/file.js";

const sendApprovalEmails = async (translationData: any, fileName: string) => {
  return await sendMails(translationData, fileName);
};

const TranslateSingle = () => {
  type DriveFile = {
    id: string;
    fileId: string;
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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | DriveFile | null>(
    null
  );
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

  const handleFileSelected = async (file: File | DriveFile | null) => {
    setSelectedFile(file);
    setTranslationResult(null);
    setUploadedFileId(null);

    if (file && file instanceof File && file.type === "application/pdf") {
      try {
        setIsUploading(true);
        const result = await uploadPdfFile(
          file,
          sourceLanguage,
          targetLanguage
        );
        setUploadedFileId(result.fileId);
        toast.success("File uploaded successfully", {
          description: `${file.name} has been uploaded to the server`,
        });
      } catch (error) {
        console.error("File upload error:", error);
        toast.error("File upload failed", {
          description: "An error occurred while uploading the file",
        });
      } finally {
        setIsUploading(false);
      }
    }
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

      // Add a manual delay (e.g., 2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

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

      const statusResponse = await changeTranslateStatus(uploadedFileId);
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const fileName =
        selectedFile instanceof File ? selectedFile.name : "document";
      const translationData = {
        sourceLanguage: getLanguageByCode(sourceLanguage).name,
        targetLanguage: getLanguageByCode(targetLanguage).name,
        sourceText: translationResult.originalText,
        translatedText: translationResult.translatedText,
        translationId: uploadedFileId || Date.now().toString(),
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
      <main className="flex-1 container mx-auto  py-8">
        <div className=" mx-auto items-center justify-center space-y-8">
          <div className="w-full items-center justify-center">
            <h2 className="text-xl font-medium mb-4">Select Languages</h2>
            <LanguageSelector
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              onSourceLanguageChange={handleSourceLanguageChange}
              onTargetLanguageChange={handleTargetLanguageChange}
              disabled={isLoading || isSaving || isSubmitting || isUploading}
            />
          </div>

          <Separator />

          <div className="w-full">
            <h2 className="text-xl font-medium mb-4">Upload Document</h2>
            <FileUpload
              type="single"
              onFileSelected={handleFileSelected}
              selectedFile={selectedFile}
              disabled={isLoading || isSaving || isSubmitting || isUploading}
            />
            {isUploading && (
              <p className="text-sm text-muted-foreground mt-2">
                Uploading file to server...
              </p>
            )}
            {uploadedFileId && (
              <p className="text-sm text-green-600 mt-2">
                File uploaded successfully (ID: {uploadedFileId.substring(0, 8)}
                ...)
              </p>
            )}
          </div>

          <div className="w-full flex justify-center">
            <Button
              onClick={handleTranslate}
              disabled={
                !selectedFile ||
                isLoading ||
                isSaving ||
                isSubmitting ||
                isUploading
              }
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
                selectedFile={selectedFile}
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
