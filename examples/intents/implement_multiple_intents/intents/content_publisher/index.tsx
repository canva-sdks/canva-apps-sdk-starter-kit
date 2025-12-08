// For usage information, see the README.md file.
import type {
  ContentPublisherIntent,
  GetPublishConfigurationResponse,
  PublishContentRequest,
  PublishContentResponse,
  RenderPreviewUiRequest,
  RenderSettingsUiRequest,
} from "@canva/intents/content";
import { createRoot } from "react-dom/client";
import "@canva/app-ui-kit/styles.css";
import { AppUiProvider, Box, Button } from "@canva/app-ui-kit";
import { Rows, Text } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";
import { requestOpenExternalUrl } from "@canva/platform";

// This example demonstrates how multiple intents can be implemented within a single Canva app.
// For a more detailed example of the Content Publisher Intent, refer to the content_publisher_intent example.

// Define the output types (publishing formats) available to users
// Canva automatically displays a dropdown selector when more than one output type is defined
async function getPublishConfiguration(): Promise<GetPublishConfigurationResponse> {
  return {
    status: "completed",
    outputTypes: [
      {
        id: "post",
        displayName: "Output type: Post",
        mediaSlots: [
          {
            id: "media",
            displayName: "Media",
            fileCount: { exact: 1 },
            accepts: {
              image: {
                format: "png",
                // Social media post aspect ratio range (portrait to landscape)
                aspectRatio: { min: 4 / 5, max: 1.91 / 1 },
              },
            },
          },
        ],
      },
    ],
  };
}

// Render the settings UI where users configure publishing options
function renderSettingsUi(request: RenderSettingsUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);

  const openDocs = async () => {
    await requestOpenExternalUrl({
      url: "https://www.canva.dev/docs/apps/content-publisher/",
    });
  };

  root.render(
    <AppUiProvider>
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Text>
            This is the content publisher intent portion of the app. Here you
            would render an interface for controlling the publishing settings.
          </Text>
          <Button variant="primary" onClick={openDocs}>
            Open Content Publisher Intent docs
          </Button>
        </Rows>
      </div>
    </AppUiProvider>,
  );
}
// Render the preview UI showing how the content will appear after publishing
function renderPreviewUi(request: RenderPreviewUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(
    <AppUiProvider>
      <div className={styles.previewContainer}>
        <Box
          className={styles.previewWrapper}
          background="surface"
          borderRadius="large"
          padding="2u"
          border="standard"
        >
          <Rows spacing="2u">
            <Text>
              This is the content publisher intent portion of the app. Here you
              would render a preview for visualising how the design would appear
              in the publishing platform.
            </Text>
          </Rows>
        </Box>
      </div>
    </AppUiProvider>,
  );
}

// Handle the actual publishing when the user clicks the publish button
// In production, this should make API calls to your platform
async function publishContent(
  request: PublishContentRequest,
): Promise<PublishContentResponse> {
  // Replace this with your actual API integration
  // Example: Upload media to your platform and create a post
  // const uploadedMedia = await uploadToYourPlatform(params.outputMedia);
  // const post = await createPostOnYourPlatform({
  //   media: uploadedMedia,
  //   caption: JSON.parse(params.publishRef).caption
  // });

  return {
    status: "completed",
    externalId: "1234567890", // Your platform's unique identifier for this post
    externalUrl: "https://example.com/posts/1234567890", // Link to view the published content
  };
}

const contentPublisher: ContentPublisherIntent = {
  renderSettingsUi,
  renderPreviewUi,
  getPublishConfiguration,
  publishContent,
};

export default contentPublisher;
