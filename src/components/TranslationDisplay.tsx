import React from "react";
import { TranslationResult } from "@/utils/translate";
import { getLanguageByCode } from "@/utils/languages";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface TranslationDisplayProps {
  result: TranslationResult | null;
  isLoading?: boolean;
}

const TextPanel: React.FC<{
  title: string;
  text: string;
  isLoading?: boolean;
}> = ({ title, text, isLoading = false }) => {
  return (
    <div className="glass-panel rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      {isLoading ? (
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      ) : (
        <div className="bg-background/50 p-3 rounded-md flex-1 overflow-y-auto scrollbar-thin">
          <p className="text-sm whitespace-pre-line">
            {text || "No text available"}
          </p>
        </div>
      )}
    </div>
  );
};

const TranslationDisplay: React.FC<TranslationDisplayProps> = ({
  result,
  isLoading = false,
}) => {
  if (!result && !isLoading) {
    return null;
  }

  const sourceLanguage = result
    ? getLanguageByCode(result.sourceLanguage).name
    : "Source";
  const targetLanguage = result
    ? getLanguageByCode(result.targetLanguage).name
    : "Target";

  return (
    <div className="w-full animate-fade-in  delay-300">
      <div className="mb-4">
        <h2 className="text-xl font-medium">Translation Results</h2>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Processing your translation..."
            : `Translated from ${sourceLanguage} to ${targetLanguage}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TextPanel
          title={sourceLanguage}
          text={result?.originalText || ""}
          isLoading={isLoading}
        />
        <TextPanel
          title={targetLanguage}
          text={result?.translatedText || ""}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TranslationDisplay;
