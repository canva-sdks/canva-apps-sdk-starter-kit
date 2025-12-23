import "@canva/app-ui-kit/styles.css";
import type { DesignEditorIntent } from "@canva/intents/design";
import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { requestOpenExternalUrl } from "@canva/platform";
import * as styles from "styles/components.css";

// This example demonstrates how multiple intents can be implemented within a single Canva app.
// For a more detailed example of the Design Editor Intent and all its capabilities, refer to other app examples in this starter kit.
async function render() {
  const root = createRoot(document.getElementById("root") as Element);

  const openDocs = async () => {
    await requestOpenExternalUrl({
      url: "https://www.canva.dev/docs/apps/design-editor/",
    });
  };

  // Render the design editor intent UI
  // This is a simple example to demonstrate how multiple intents can be implemented in the same app.
  root.render(
    <AppUiProvider>
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Text>This is the design editor intent portion of the app.</Text>
          <Button variant="primary" onClick={openDocs}>
            Open Design Editor Intent docs
          </Button>
        </Rows>
      </div>
    </AppUiProvider>,
  );
}

const designEditor: DesignEditorIntent = { render };
export default designEditor;
