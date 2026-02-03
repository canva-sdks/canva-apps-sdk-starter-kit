import type {
  ContentPublisherIntent,
  GetPublishConfigurationResponse,
  PublishContentRequest,
  PublishContentResponse,
  RenderPreviewUiRequest,
  RenderSettingsUiRequest,
} from "@canva/intents/content";
import { prepareContentPublisher } from "@canva/intents/content";
import { createRoot } from "react-dom/client";
import "@canva/app-ui-kit/styles.css";
import { AppUiProvider } from "@canva/app-ui-kit";
import { AppI18nProvider, initIntl } from "@canva/app-i18n-kit";
import { PreviewUi } from "./preview_ui";
import { SettingUi } from "./setting_ui";

const intl = initIntl();

// Render the settings UI where users configure publishing options
function renderSettingsUi({
  updatePublishSettings,
  registerOnContextChange,
}: RenderSettingsUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <SettingUi
          updatePublishSettings={updatePublishSettings}
          registerOnContextChange={registerOnContextChange}
        />
      </AppUiProvider>
    </AppI18nProvider>,
  );
}
// Render the preview UI showing how the content will appear after publishing
function renderPreviewUi({ registerOnPreviewChange }: RenderPreviewUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <PreviewUi registerOnPreviewChange={registerOnPreviewChange} />
      </AppUiProvider>
    </AppI18nProvider>,
  );
}

// Define the output types (publishing formats) available to users
// Canva automatically displays a dropdown selector when more than one output type is defined
async function getPublishConfiguration(): Promise<GetPublishConfigurationResponse> {
  return {
    status: "completed",
    outputTypes: [
      {
        id: "post",
        displayName: intl.formatMessage({
          defaultMessage: "Feed Post",
          description:
            "Label for publishing format shown in the output type dropdown",
        }),
        mediaSlots: [
          {
            id: "media",
            displayName: intl.formatMessage({
              defaultMessage: "Media",
              description: "Label for the media upload slot",
            }),
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

// Initialize the Content Publisher intent
// This configures the app to handle content publishing workflows
prepareContentPublisher(contentPublisher);
