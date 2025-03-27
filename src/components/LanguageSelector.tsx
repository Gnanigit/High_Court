import React from "react";
import { languages, Language } from "@/utils/languages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

interface LanguageSelectorProps {
  sourceLanguage: string;
  targetLanguage: string;
  onSourceLanguageChange: (value: string) => void;
  onTargetLanguageChange: (value: string) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 rounded-lg glass-panel animate-scale-in">
      <div className="w-full sm:w-auto">
        <label
          htmlFor="source-language"
          className="block text-sm font-medium text-muted-foreground mb-1.5"
        >
          Source Language
        </label>
        <Select
          value={sourceLanguage}
          onValueChange={onSourceLanguageChange}
          disabled={disabled}
        >
          <SelectTrigger id="source-language" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang: Language) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden sm:flex items-center justify-center mt-6">
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="w-full sm:w-auto">
        <label
          htmlFor="target-language"
          className="block text-sm font-medium text-muted-foreground mb-1.5"
        >
          Target Language
        </label>
        <Select
          value={targetLanguage}
          onValueChange={onTargetLanguageChange}
          disabled={disabled}
        >
          <SelectTrigger id="target-language" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang: Language) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                disabled={lang.code === sourceLanguage}
              >
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LanguageSelector;
