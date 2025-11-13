import type { PublishContentRequest } from "@canva/intents/content";
import { prepareContentPublisher } from "@canva/intents/content";
import { createRoot } from "react-dom/client";
import "@canva/app-ui-kit/styles.css";
import { AppUiProvider } from "@canva/app-ui-kit";
import { PreviewUi } from "./preview_ui";
import { SettingUi } from "./setting_ui";

const root = createRoot(document.getElementById("root") as Element);

// Initialize the Content Publisher intent
// This configures the app to handle content publishing workflows
prepareContentPublisher({
  // Render the settings UI where users configure publishing options
  renderSettingsUi: ({
    updatePublishSettings,
    registerOnSettingsUiContextChange,
  }) => {
    root.render(
      <AppUiProvider>
        <SettingUi
          updatePublishSettings={updatePublishSettings}
          registerOnSettingsUiContextChange={registerOnSettingsUiContextChange}
        />
      </AppUiProvider>,
    );
  },
  // Render the preview UI showing how the content will appear after publishing
  renderPreviewUi: ({ registerOnPreviewChange }) => {
    root.render(
      <AppUiProvider>
        <PreviewUi registerOnPreviewChange={registerOnPreviewChange} />
      </AppUiProvider>,
    );
  },

  // Define the output types (publishing formats) available to users
  // Canva automatically displays a dropdown selector when more than one output type is defined
  getPublishConfiguration: async () => {
    return {
      status: "completed",
      outputTypes: [
        {
          id: "post",
          displayName: "Feed Post",
          mediaSlots: [
            {
              id: "media",
              displayName: "Media",
              required: true,
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
  },
  // Handle the actual publishing when the user clicks the publish button
  // In production, this should make API calls to your platform
  publishContent: async (request: PublishContentRequest) => {
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
  },
});
