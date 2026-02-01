import { Box } from "@canva/app-ui-kit";
import type { OutputType, PreviewMedia } from "@canva/intents/content";
import { useEffect, useState } from "react";
import * as styles from "../../../styles/preview_ui.css";
import { PostPreview } from "./post_preview";
import { parsePublishSettings } from "./types";

interface PreviewUiProps {
  registerOnPreviewChange: (
    callback: (opts: {
      previewMedia: PreviewMedia[];
      outputType: OutputType;
      publishRef?: string;
    }) => void,
  ) => () => void;
}

// TODO: Replace with real user data from your platform
// After implementing authentication (see README), fetch the connected user's profile
// to display their actual username and avatar in the preview.
const username = "username";

// Main preview UI component that receives preview updates when settings or pages change.
// Preview UI is more flexible to align with your platform's design system, so it is not constrained to the Canva design system.
export const PreviewUi = ({ registerOnPreviewChange }: PreviewUiProps) => {
  const [previewData, setPreviewData] = useState<{
    previewMedia: PreviewMedia[];
    outputType: OutputType;
    publishRef?: string;
  } | null>(null);

  // Register to receive preview updates whenever settings or pages change
  useEffect(() => {
    const dispose = registerOnPreviewChange((data) => {
      setPreviewData(data);
    });
    return dispose;
  }, [registerOnPreviewChange]);

  const { previewMedia, publishRef, outputType } = previewData ?? {};
  const publishSettings = parsePublishSettings(publishRef);

  return (
    <Box
      className={styles.container}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width="full"
      height="full"
    >
      {outputType?.id === "post" && (
        <PostPreview
          previewMedia={previewMedia}
          settings={publishSettings}
          username={username}
        />
      )}
    </Box>
  );
};
