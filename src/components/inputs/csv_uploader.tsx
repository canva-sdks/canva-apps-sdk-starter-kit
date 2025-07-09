import React, { useRef } from "react";
import { Button } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

interface CsvUploaderProps {
  onFileUpload: (file: File) => void;
  disabled?: boolean;
}

export function CsvUploader({ onFileUpload, disabled = false }: CsvUploaderProps) {
  const intl = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleFileUpload}
        disabled={disabled}
        stretch
      >
        {intl.formatMessage({
          defaultMessage: "Upload CSV file",
          description: "Button to upload CSV file",
        })}
      </Button>
      
      {/* eslint-disable-next-line react/forbid-elements */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
} 