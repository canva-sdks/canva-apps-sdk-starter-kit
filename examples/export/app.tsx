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
  const [exportResponse, setExportResponse] = useState<
    ExportResponse | undefined
  >();

  const exportDocument = async () => {
    if (state === "exporting") return;
    try {
      setState("exporting");

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

      // TODO: Send the URL to your backend using fetch
      setExportResponse(response);
    } catch (error) {
      // TODO: Add error handling
      // eslint-disable-next-line no-console
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
          Export
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
