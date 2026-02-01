import {
  Avatar,
  Box,
  ImageCard,
  Placeholder,
  Rows,
  Text,
  TextPlaceholder,
} from "@canva/app-ui-kit";
import type { Preview, PreviewMedia } from "@canva/intents/content";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "../../../styles/preview_ui.css";
import type { PublishSettings } from "./types";

const IMAGE_WIDTH = 400;

interface PreviewProps {
  previewMedia: PreviewMedia[] | undefined;
  settings: PublishSettings | undefined;
  username: string;
}

// TODO: Customize this preview to match what the published content will look like on your platform.
// This example shows a generic social media post with avatar, image, and caption.
// Consider: platform-specific dimensions, branding colors, and UI elements.
export const PostPreview = ({
  previewMedia,
  settings,
  username,
}: PreviewProps) => {
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
          <UserInfo isLoading={isLoading} username={username} />
          <ImagePreview previewMedia={previewMedia} />
          <Caption isLoading={isLoading} caption={caption} />
        </Rows>
      </Box>
    </div>
  );
};

// Renders user profile information with avatar and username
const UserInfo = ({
  isLoading,
  username,
}: {
  isLoading: boolean;
  username: string;
}) => {
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
  const intl = useIntl();
  // Handle different preview states
  if (preview.status === "loading") {
    return (
      <ImageStatusText
        text={intl.formatMessage({
          defaultMessage: "Loading...",
          description: "Text displayed while the preview is loading",
        })}
      />
    );
  }

  if (preview.status === "error") {
    return (
      <ImageStatusText
        text={intl.formatMessage({
          defaultMessage: "Error loading preview",
          description:
            "Text displayed when there is an error loading the preview",
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
            defaultMessage: "Image preview {previewId}",
            description: "Alt text for image preview in the preview UI",
          },
          { previewId: preview.id },
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
        <FormattedMessage
          defaultMessage="Preview not available"
          description="Text displayed when the preview type is not supported"
        />
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

/**
 * Type guard to check if a preview is an image preview that's ready to display
 */
export function isImagePreviewReady(preview: Preview): preview is Preview & {
  kind: "image";
  status: "ready";
  url: string;
} {
  return (
    preview.kind === "image" &&
    preview.status === "ready" &&
    preview.url != null
  );
}
