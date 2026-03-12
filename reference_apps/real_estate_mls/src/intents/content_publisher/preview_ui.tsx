import type {
  Preview,
  PreviewMedia,
  RenderPreviewUiRequest,
} from "@canva/intents/content";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { isImagePreviewReady, parsePublishSettings } from "./types";
import {
  Box,
  Text,
  Rows,
  ImageCard,
  Placeholder,
  TextPlaceholder,
} from "@canva/app-ui-kit";

type PreviewData = Parameters<
  Parameters<RenderPreviewUiRequest["registerOnPreviewChange"]>[0]
>[0];

/**
 * Preview UI for the Content Publisher intent.
 *
 * We render this panel to show the user a mock-up of how their
 * published content will look on the destination platform. The preview
 * updates reactively whenever the user changes settings or the exported
 * media is re-rendered — we receive those updates through the
 * `registerOnPreviewChange` callback.
 *
 * TODO: Customise ListingPreview (or replace it entirely) to match your
 * platform's export requirements.
 *
 * @see https://www.canva.dev/docs/apps/content-publisher/
 */
export const PreviewUi = ({
  registerOnPreviewChange,
}: RenderPreviewUiRequest) => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // Subscribe to preview updates from Canva. The callback fires whenever
  // the design media, publish settings, or output type changes.
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
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width="full"
      height="full"
    >
      {outputType?.id === "listing" && (
        <ListingPreview
          previewMedia={previewMedia}
          settings={publishSettings}
        />
      )}
    </Box>
  );
};

const ListingPreview = ({
  previewMedia,
  settings,
}: {
  previewMedia: PreviewMedia[] | undefined;
  settings: ReturnType<typeof parsePublishSettings>;
}) => {
  const intl = useIntl();
  const isLoading = !previewMedia;

  return (
    <Box
      background="surface"
      borderRadius="large"
      padding="2u"
      border="standard"
    >
      <Rows spacing="2u">
        <ImagePreview previewMedia={previewMedia} />
        <Caption isLoading={isLoading} caption={settings?.caption} />
        <Text size="small" tone="tertiary">
          {intl.formatMessage({
            defaultMessage: "Real Estate MLS",
            description: "Platform name shown in preview",
          })}
        </Text>
      </Rows>
    </Box>
  );
};

const Caption = ({
  isLoading,
  caption,
}: {
  isLoading: boolean;
  caption: string | undefined;
}) => {
  if (isLoading) {
    return <TextPlaceholder size="medium" />;
  }

  if (!caption) {
    return null;
  }

  return (
    <Text lineClamp={3} size="small">
      {caption}
    </Text>
  );
};

const ImagePreview = ({
  previewMedia,
}: {
  previewMedia: PreviewMedia[] | undefined;
}) => {
  const media = previewMedia?.find((m) => m.mediaSlotId === "media");
  const preview = media?.previews[0];

  return (
    <Box borderRadius="large">
      {preview ? (
        <PreviewRenderer preview={preview} />
      ) : (
        <Placeholder shape="rectangle" />
      )}
    </Box>
  );
};

const PreviewRenderer = ({ preview }: { preview: Preview }) => {
  const intl = useIntl();

  if (preview.status === "loading") {
    return <Placeholder shape="rectangle" />;
  }

  if (isImagePreviewReady(preview)) {
    return (
      <ImageCard
        alt={intl.formatMessage(
          {
            defaultMessage: "Listing image preview {id}",
            description: "Alt text for listing image preview",
          },
          { id: preview.id },
        )}
        thumbnailUrl={preview.url}
      />
    );
  }

  return (
    <Box
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
