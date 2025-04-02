import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Text,
  Edit,
  Trash,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface ToolbarProps {
  currentTool: "select" | "text" | "eraser";
  onToolChange: (tool: "select" | "text" | "eraser") => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Toolbar = ({
  currentTool,
  onToolChange,
  currentPage,
  totalPages,
  onPageChange,
}: ToolbarProps) => {
  const pageInputRef = useRef<HTMLInputElement>(null);

  const handlePageInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPage = parseInt(pageInputRef.current?.value || "1", 10);
      if (!isNaN(newPage)) {
        onPageChange(newPage);
      }
    }
  };

  return (
    <div className="p-2 bg-gray-50 border-b flex items-center justify-between overflow-x-auto">
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onToolChange("select")}
          className={currentTool === "select" ? "bg-blue-100" : ""}
          title="Selection Tool"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onToolChange("text")}
          className={currentTool === "text" ? "bg-blue-100" : ""}
          title="Add Text"
        >
          <Text className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onToolChange("eraser")}
          className={currentTool === "eraser" ? "bg-blue-100" : ""}
          title="Eraser"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8 mx-2" />

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Previous Page"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          <Input
            ref={pageInputRef}
            className="w-12 text-center"
            defaultValue={currentPage}
            onKeyDown={handlePageInputChange}
            title="Current Page"
          />
          <span className="text-sm text-gray-500">/ {totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Next Page"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8 mx-2" />

      <div className="flex items-center space-x-1">
        <Button variant="outline" size="icon" title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8 mx-2" />

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          className="flex items-center space-x-1"
          title="Save Changes"
        >
          <Save className="h-4 w-4 mr-1" />
          <span>Save</span>
        </Button>
        <Button
          variant="default"
          className="flex items-center space-x-1"
          title="Download PDF"
        >
          <Download className="h-4 w-4 mr-1" />
          <span>Download</span>
        </Button>
      </div>
    </div>
  );
};
