import React from "react";
import useDrivePicker from "react-google-drive-picker";
import { Button } from "@/components/ui/button";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
  webViewLink?: string;
  webContentLink?: string;
}

interface GoogleDrivePickerProps {
  onFileSelected: (file: DriveFile | null) => void;
}

const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({
  onFileSelected,
}) => {
  const [openPicker] = useDrivePicker();
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleOpenPicker = () => {
    openPicker({
      clientId: CLIENT_ID,
      developerKey: API_KEY,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: (data: any) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        } else if (data.docs && data.docs.length > 0) {
          const fileData = data.docs[0];
          const fileId = fileData.id;

          // For PDFs, generate a viewable URL specifically for embedding
          let previewUrl = fileData.webViewLink;

          // If it's a PDF from Google Drive, create an embeddable URL
          if (fileData.mimeType === "application/pdf") {
            previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
          }

          const file = {
            id: fileId,
            name: fileData.name,
            mimeType: fileData.mimeType,
            url: previewUrl,
            webViewLink: fileData.webViewLink,
            webContentLink: fileData.webContentLink,
          };

          console.log("Selected File:", file);
          onFileSelected(file);
        }
      },
    });
  };

  return (
    <Button
      onClick={handleOpenPicker}
      className="bg-primary_head hover:bg-primary_head text-white px-4 py-2 rounded flex items-center"
    >
      Import From Google Drive
    </Button>
  );
};

export default GoogleDrivePicker;
