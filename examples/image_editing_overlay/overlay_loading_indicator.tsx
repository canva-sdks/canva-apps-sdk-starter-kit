import * as React from "react";
import { Box, LoadingIndicator } from "@canva/app-ui-kit";
import styles from "./overlay_loading_indicator.css";

export const OverlayLoadingIndicator = () => (
  <Box
    display="flex"
    width="full"
    height="full"
    justifyContent="center"
    alignItems="center"
    className={styles.overlayLoadingIndicator}
  >
    <LoadingIndicator size="large" />
  </Box>
);
