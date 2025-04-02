import React, { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { Button } from "@/components/ui/button";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

const GoogleDrivePicker: React.FC = () => {
  const [openPicker] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
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
      multiselect: true,
      callbackFunction: (data: any) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        } else if (data.docs) {
          console.log("Selected Files:", data.docs);
          setSelectedFiles(
            data.docs.map((file: any) => ({
              id: file.id,
              name: file.name,
              mimeType: file.mimeType,
              url: file.url,
            }))
          );
        }
      },
    });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Button
        onClick={handleOpenPicker}
        className="bg-primary_head hover:bg-primary_head text-white px-4 py-2 rounded flex items-center mb-5"
      >
        Import From Google Drive
      </Button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {selectedFiles.map((file) => (
          <div
            key={file.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              textAlign: "left",
            }}
          >
            <h4 style={{ fontSize: "14px", marginBottom: "10px" }}>
              {file.name}
            </h4>
            <p style={{ fontSize: "12px", marginBottom: "10px" }}>
              <strong>Type:</strong> {file.mimeType}
            </p>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              Open File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleDrivePicker;
