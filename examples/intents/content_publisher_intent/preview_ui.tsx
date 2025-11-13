import type { OutputType, PreviewMedia } from "@canva/intents/content";
import { useEffect, useState } from "react";
import { parsePublishSettings } from "./types";
import * as styles from "./preview_ui.css";
import {
  Box,
  Text,
  Rows,
  Avatar,
  Placeholder,
  TextPlaceholder,
  ImageCard,
} from "@canva/app-ui-kit";
import type { Preview } from "@canva/intents/content";
import { isImagePreviewReady, type PublishSettings } from "./types";

// Static user data for demo purposes
// In production, fetch real user data from your platform's API
const username = "username";
const IMAGE_WIDTH = 400;

interface PreviewUiProps {
  registerOnPreviewChange: (
    callback: (opts: {
      previewMedia: PreviewMedia[];
      outputType: OutputType;
      publishRef?: string;
    }) => void,
  ) => () => void;
}

// Main preview UI component that receives preview updates when settings or pages change.
// preview UI is more flexible to align with your platform's design system, so it is not constrained to the Canva design system.
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
    <div className={styles.container}>
      {outputType?.id === "post" && (
        <PostPreview previewMedia={previewMedia} settings={publishSettings} />
      )}
    </div>
  );
};

interface PreviewProps {
  previewMedia: PreviewMedia[] | undefined;
  settings: PublishSettings | undefined;
}

// Renders a social media post preview with user info, media, and caption
export const PostPreview = ({ previewMedia, settings }: PreviewProps) => {
  const isLoading = !previewMedia;

  const caption = settings?.caption;

  return (
    <Box
      className={styles.wrapper}
      background="surface"
      borderRadius="large"
      padding="2u"
      border="standard"
    >
      <Rows spacing="2u">
        <UserInfo isLoading={isLoading} />
        <ImagePreview previewMedia={previewMedia} />
        <Caption isLoading={isLoading} caption={caption} />
      </Rows>
    </Box>
  );
};

// Renders user profile information with avatar and username
const UserInfo = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className={styles.user}>
      <Box className={styles.avatar}>
        <Avatar name={username} />
      </Box>
      {isLoading ? (
        <div className={styles.textPlaceholder}>
          <TextPlaceholder size="medium" />
        </div>
      ) : (
        <Text size="small" variant="bold">
          {username}
        </Text>
      )}
    </div>
  );
};

// Renders the post caption with username
const Caption = ({
  isLoading,
  caption,
}: {
  isLoading: boolean;
  caption: string | undefined;
}) => {
  return (
    <>
      {isLoading ? (
        <div className={styles.textPlaceholder}>
          <TextPlaceholder size="medium" />
        </div>
      ) : (
        caption && (
          <Text lineClamp={2} size="small">
            {caption}
          </Text>
        )
      )}
    </>
  );
};

// Renders a single image post preview
const ImagePreview = ({
  previewMedia,
}: {
  previewMedia: PreviewMedia[] | undefined;
}) => {
  const isLoading = !previewMedia;
  const media = previewMedia?.find((media) => media.mediaSlotId === "media");
  const fullWidth = (media?.previews.length ?? 1) * IMAGE_WIDTH;

  return (
    <Box borderRadius="large" className={styles.imageContainer}>
      {isLoading || !media?.previews.length ? (
        <div className={styles.imagePlaceholder}>
          <Placeholder shape="rectangle" />
        </div>
      ) : (
        <div className={styles.imageRow} style={{ width: fullWidth }}>
          {media?.previews.map((p) => {
            return (
              <div key={p.id} className={styles.image}>
                <PreviewRenderer preview={p} />
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
};

// Renders individual preview based on its type and status
const PreviewRenderer = ({ preview }: { preview: Preview }) => {
  // Handle different preview states
  if (preview.status === "loading") {
    return <ImageStatusText text="Loading..." />;
  }

  if (preview.status === "error") {
    return <ImageStatusText text="Error loading preview" />;
  }

  // Handle image previews (ready status)
  if (isImagePreviewReady(preview)) {
    return (
      <ImageCard
        alt={`Image preview ${preview.id}`}
        thumbnailUrl={preview.url}
      />
    );
  }

  // Fallback for unknown preview types
  return (
    <Box
      width="full"
      height="full"
      padding="2u"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text size="medium" tone="tertiary" alignment="center">
        Preview not available
      </Text>
    </Box>
  );
};

// Helper component to display status text for loading/error states
const ImageStatusText = ({ text }: { text: string }) => (
  <Box
    width="full"
    height="full"
    padding="2u"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Text size="medium" tone="tertiary" alignment="center">
      {text}
    </Text>
  </Box>
);
