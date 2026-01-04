import "@canva/app-ui-kit/styles.css";
import type { DesignEditorIntent } from "@canva/intents/design";
import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { publish, bulkCreate } from "@canva/design";
import { useFeatureSupport } from "@canva/app-hooks";
import * as styles from "styles/components.css";

// This example demonstrates how to launch Content Publisher Intent and Bulk Create with Data Connector Intent from within a Design Editor Intent.
// For a more detailed example of the Design Editor Intent and all its capabilities, refer to other app examples in this starter kit.

const App = () => {
  const isSupported = useFeatureSupport();
  const bulkCreateSupported = isSupported(bulkCreate.launch);
  const publishSupported = isSupported(publish.launch);

  const launchBulkCreate = async () => {
    await bulkCreate.launch({ withDataConnector: "self" });
  };

  const launchContentPublisher = async () => {
    await publish.launch({ withContentPublisher: "self" });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>This is the design editor intent portion of the app.</Text>
        {bulkCreateSupported && (
          <Button variant="primary" onClick={launchBulkCreate}>
            Launch Bulk Create with Data Connector Intent
          </Button>
        )}
        {publishSupported && (
          <Button variant="primary" onClick={launchContentPublisher}>
            Launch Content Publisher Intent
          </Button>
        )}
      </Rows>
    </div>
  );
};

async function render() {
  const root = createRoot(document.getElementById("root") as Element);

  // Render the design editor intent UI
  root.render(
    <AppUiProvider>
      <App />
    </AppUiProvider>,
  );
}

const designEditor: DesignEditorIntent = { render };
export default designEditor;
