import React, { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import MultipleFileUpload from "./MultipleFileUpload";
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

const TranslateMultiple = () => {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("tel");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Updated to an array
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelected = (files: File[]) => {
    setSelectedFiles(files);
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
    if (selectedFiles.length === 0) {
      toast.error("No file selected", {
        description: "Please upload at least one document to translate",
      });
      return;
    }

    try {
      setIsLoading(true);
      setTranslationResult(null);

      // Extract and translate text for all files
      const translations = await Promise.all(
        selectedFiles.map(async (file) => {
          const extractedText = await extractTextFromImage(file);
          return translateText(extractedText, sourceLanguage, targetLanguage);
        })
      );

      setTranslationResult(translations[0]); // Handle multiple translations as needed

      const sourceLanguageFull = getLanguageByCode(sourceLanguage).name;
      const targetLanguageFull = getLanguageByCode(targetLanguage).name;

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-lg max-w-2xl animate-slide-up delay-75">
            Upload{" "}
            <span className="text-primary_head font-bold">multiple PDFs</span>{" "}
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
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="w-full">
            <h2 className="text-xl font-medium mb-4">Upload Documents</h2>
            <MultipleFileUpload
              type="multiple"
              onFilesSelected={handleFileSelected}
              selectedFiles={selectedFiles} // Updated prop name
              disabled={isLoading}
            />
          </div>

          <div className="w-full flex justify-center">
            <Button
              onClick={handleTranslate}
              disabled={selectedFiles.length === 0 || isLoading} // Fixed condition
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
