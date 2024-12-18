import { SearchableListView } from "@canva/app-components";
import { Box } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { useConfig } from "./config";
import { findResources } from "./adapter";
import * as styles from "./index.css";

export function App() {
  const config = useConfig();
  return (
    <Box className={styles.rootWrapper}>
      <SearchableListView
        config={config}
        findResources={findResources}
        // TODO remove `saveExportedDesign` and `config.export` if your app does not support exporting the Canva design into an external platform
        saveExportedDesign={(
          exportedDesignUrl: string,
          containerId: string | undefined,
          designTitle: string | undefined,
        ) => {
          // TODO update the function to save the design to your platform
          return new Promise((resolve) => {
            setTimeout(() => {
              // eslint-disable-next-line no-console
              console.info(
                `Saving file "${designTitle}" from ${exportedDesignUrl} to ${config.serviceName} container id: ${containerId}`,
              );
              resolve({ success: true });
            }, 1000);
          });
        }}
      />
    </Box>
  );
}
