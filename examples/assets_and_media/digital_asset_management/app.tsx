// For usage information, see the README.md file.
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
      {/*
        SearchableListView is a Canva component that provides a complete digital asset management interface.
        It handles searching, filtering, browsing containers, and importing assets from external platforms.
      */}
      <SearchableListView
        config={config}
        findResources={findResources}
        /*
          Remove the saveExportedDesign prop and config.export settings if your app
          does not support exporting Canva designs to an external platform
        */
        saveExportedDesign={(
          exportedDesignUrl: string,
          containerId: string | undefined,
          designTitle: string | undefined,
        ) => {
          /*
            Replace this mock implementation with your platform's actual save logic.
            The function should save the exported design to your digital asset management system.
          */
          return new Promise((resolve) => {
            setTimeout(() => {
              /* eslint-disable-next-line no-console */
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
