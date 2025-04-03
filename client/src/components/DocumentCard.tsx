import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Check, X } from "lucide-react";

interface DocumentCardProps {
  fileName: string;
  sourceLanguage?: string;
  translatedLanguage?: string;
  translated: boolean;
  approval_1: boolean;
  approval_2: boolean;
  approval_3?: boolean;
  onView: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  fileName,
  sourceLanguage,
  translatedLanguage,
  translated,
  approval_1,
  approval_2,
  approval_3,
  onView,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-blue-50 p-2">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-medium text-gray-900 truncate">{fileName}</h3>
            <div className="text-sm text-gray-500 mt-1">
              {sourceLanguage && <p>From: {sourceLanguage}</p>}
              {translatedLanguage && <p>To: {translatedLanguage}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
            <span className="text-xs text-gray-500">Translated</span>
            {translated ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-primary_head" />
            )}
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
            <span className="text-xs text-gray-500">Review 1</span>
            {approval_1 ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-primary_head" />
            )}
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
            <span className="text-xs text-gray-500">Review 2</span>
            {approval_2 ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-primary_head" />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 ">
        <Button variant="outline" size="sm" className="w-full" onClick={onView}>
          View Document
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
