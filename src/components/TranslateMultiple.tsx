import React, { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import FileUpload from "@/components/FileUpload";
import TranslationDisplay from "@/components/TranslationDisplay";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import {
  extractTextFromImage,
  translateText,
  TranslationResult,
} from "@/utils/translate";

const TranslateMultiple = () => {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelected = (file: File | null) => {
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
      toast.success("Translation complete", {
        description: `Translated from ${sourceLanguage} to ${targetLanguage}`,
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-lg max-w-2xl animate-slide-up delay-75">
            Upload multiple PDFs containing text, select the languages, and
            instantly translate the content.
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
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="w-full">
            <h2 className="text-xl font-medium mb-4">Upload Document</h2>
            <FileUpload
              type="multiple"
              onFileSelected={handleFileSelected}
              selectedFile={selectedFile}
              disabled={isLoading}
            />
          </div>

          <div className="w-full flex justify-center">
            <Button
              onClick={handleTranslate}
              disabled={!selectedFile || isLoading}
              className="w-full sm:w-auto px-8 transition-all bg-primary_head/50 hover:bg-primary_head"
            >
              {isLoading ? "Translating..." : "Translate Now"}
            </Button>
          </div>

          {/* Results */}
          {(translationResult || isLoading) && (
            <>
              <Separator className="my-8" />
              <TranslationDisplay
                result={translationResult}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TranslateMultiple;
