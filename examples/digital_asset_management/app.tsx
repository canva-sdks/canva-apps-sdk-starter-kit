import { SearchableListView } from "@canva/app-components";
import { Box } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { config } from "./config";
import { findResources } from "./adapter";
import * as styles from "./index.css";

export function App() {
  return (
    <Box className={styles.rootWrapper}>
      <SearchableListView config={config} findResources={findResources} />
    </Box>
  );
}
