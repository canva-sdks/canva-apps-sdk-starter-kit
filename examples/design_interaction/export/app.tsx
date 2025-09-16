// For usage information, see the README.md file.
import {
  Button,
  FormField,
  MultilineInput,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import type { ExportResponse } from "@canva/design";
import { requestExport } from "@canva/design";
import { useState } from "react";
import * as styles from "styles/components.css";

export const App = () => {
  const [state, setState] = useState<"exporting" | "idle">("idle");
  // Store the export response containing URLs and metadata for the exported design
  const [exportResponse, setExportResponse] = useState<
    ExportResponse | undefined
  >();

  const exportDocument = async () => {
    if (state === "exporting") return;
    try {
      setState("exporting");

      // Request export with multiple format options - Canva will present user with format selection
      const response = await requestExport({
        acceptedFileTypes: [
          "png",
          "pdf_standard",
          "jpg",
          "gif",
          "svg",
          "video",
          "pptx",
        ],
      });

      // In production apps: Send the export URL to your backend service for processing
      // Replace this with: await fetch('/api/process-export', { method: 'POST', body: JSON.stringify(response) })
      setExportResponse(response);
    } catch (error) {
      // In production apps: Implement comprehensive error handling with user-friendly messages
      // Replace console.log with proper error reporting and user feedback
      /* eslint-disable-next-line no-console */
      console.log(error);
    } finally {
      setState("idle");
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>This example demonstrates how apps can export designs.</Text>
        <Button
          variant="primary"
          onClick={exportDocument}
          loading={state === "exporting"}
          stretch
        >
          Export design
        </Button>
        {exportResponse && (
          <FormField
            label="Export response"
            value={JSON.stringify(exportResponse, null, 2)}
            control={(props) => (
              <MultilineInput {...props} maxRows={7} autoGrow readOnly />
            )}
          />
        )}
      </Rows>
    </div>
  );
};
