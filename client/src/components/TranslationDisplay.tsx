import React, { useEffect, useState } from "react";
import { TranslationResult } from "@/utils/translate";
import { getLanguageByCode } from "@/utils/languages";
import { Skeleton } from "@/components/ui/skeleton";

interface TranslationDisplayProps {
  result: TranslationResult | null;
  isLoading?: boolean;
  selectedFile: File | { name: string; url: string } | null;
}

const DocumentPreviewPanel: React.FC<{
  title: string;
  fileUrl: string | null;
  fileName: string;
  isLoading?: boolean;
}> = ({ title, fileUrl, fileName, isLoading = false }) => {
  const isImage = fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|svg)$/);

  return (
    <div className="glass-panel rounded-lg p-4 h-full flex flex-col w-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      {isLoading ? (
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div className="bg-background/50 p-3 rounded-md flex-1 overflow-hidden flex flex-col w-full">
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
                className="w-full h-[700px]"
                title={fileName}
                frameBorder="0"
                allowFullScreen
              />
            )
          ) : (
            <div className="flex items-center justify-center flex-1 bg-muted/20 rounded text-sm text-muted-foreground h-[700px]">
              No preview available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TranslationDisplay: React.FC<TranslationDisplayProps> = ({
  result,
  isLoading = false,
  selectedFile,
}) => {
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);
  const [translatedFileUrl, setTranslatedFileUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile instanceof File) {
        setOriginalFileUrl(URL.createObjectURL(selectedFile));
      } else if ("url" in selectedFile) {
        setOriginalFileUrl(selectedFile.url);
      }

      if (selectedFile instanceof File || "name" in selectedFile) {
        const fileName =
          selectedFile instanceof File ? selectedFile.name : selectedFile.name;

        const dashIndex = fileName.indexOf("-");
        const baseName =
          dashIndex !== -1 ? fileName.substring(0, dashIndex) : fileName;

        const translatedFilePath = `/QIT_Model/${baseName}-QIT Output.pdf`;

        console.log(translatedFilePath);
        setTranslatedFileUrl(translatedFilePath);
      }
    } else {
      setOriginalFileUrl(null);
      setTranslatedFileUrl(null);
    }

    // Clean up URLs on unmount
    return () => {
      if (originalFileUrl && originalFileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(originalFileUrl);
      }
    };
  }, [selectedFile]);

  if (!result && !isLoading && !selectedFile) {
    return null;
  }

  const sourceLanguage = result
    ? getLanguageByCode(result.sourceLanguage).name
    : "Source Document";
  const targetLanguage = result
    ? getLanguageByCode(result.targetLanguage).name
    : "Translated Document";

  const fileName = selectedFile
    ? selectedFile instanceof File
      ? selectedFile.name
      : selectedFile.name
    : "Unknown File";

  // Extract base name for display in the translated panel
  const dashIndex = fileName.indexOf("-");
  const baseName =
    dashIndex !== -1 ? fileName.substring(0, dashIndex) : fileName;
  const translatedFileName = `${baseName}-QIT Output.pdf`;

  return (
    <div className="w-full animate-fade-in delay-300">
      <div className="mb-4">
        <h2 className="text-xl font-medium">Translation Results</h2>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Processing your translation..."
            : `Translated from ${sourceLanguage} to ${targetLanguage}`}
        </p>
      </div>

      {/* Changed to flex column layout for larger, full-width previews */}
      <div className="flex flex-row gap-10 mb-6 w-full">
        <DocumentPreviewPanel
          title={sourceLanguage}
          fileUrl={originalFileUrl}
          fileName={fileName}
          isLoading={isLoading}
        />
        <DocumentPreviewPanel
          title={targetLanguage}
          fileUrl={translatedFileUrl}
          fileName={translatedFileName}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TranslationDisplay;
