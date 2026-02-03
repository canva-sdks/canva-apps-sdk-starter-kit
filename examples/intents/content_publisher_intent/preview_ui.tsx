import type { OutputType, PreviewMedia } from "@canva/intents/content";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { parsePublishSettings } from "./types";
import * as styles from "./preview_ui.css";
import {
  Box,
  Text,
  Rows,
  Columns,
  Column,
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
        <PostPreview previewMedia={previewMedia} settings={publishSettings} />
      )}
    </Box>
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

  // TODO: You should update this value to match the visuals you're hoping to achieve with your export preview
  // Image width + padding + border
  const previewWidth = 400 + 32 + 2;

  return (
    <div style={{ width: previewWidth }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
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
    </div>
  );
};

// Renders user profile information with avatar and username
const UserInfo = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Columns spacing="1u" alignY="center">
      <Column width="content">
        <Box className={styles.avatar}>
          <Avatar name={username} />
        </Box>
      </Column>
      <Column width="content">
        {isLoading ? (
          <div className={styles.textPlaceholder}>
            <TextPlaceholder size="medium" />
          </div>
        ) : (
          <Text size="small" variant="bold">
            {username}
          </Text>
        )}
      </Column>
    </Columns>
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
          {media?.previews
            .filter((p) => p.kind !== "email")
            .map((p) => {
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
  if (preview.kind === "email") {
    return null;
  }

  const intl = useIntl();

  // Handle different preview states
  if (preview.status === "loading") {
    return (
      <ImageStatusText
        text={intl.formatMessage({
          defaultMessage: "Loading...",
          description:
            "Loading state text shown while image preview is loading",
        })}
      />
    );
  }

  if (preview.status === "error") {
    return (
      <ImageStatusText
        text={intl.formatMessage({
          defaultMessage: "Error loading preview",
          description: "Error message shown when image preview fails to load",
        })}
      />
    );
  }

  // Handle image previews (ready status)
  if (isImagePreviewReady(preview)) {
    return (
      <ImageCard
        alt={intl.formatMessage(
          {
            defaultMessage: "Image preview {id}",
            description: "Alt text for image preview thumbnails",
          },
          { id: preview.id },
        )}
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
        {intl.formatMessage({
          defaultMessage: "Preview not available",
          description: "Fallback text shown when preview type is not supported",
        })}
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
