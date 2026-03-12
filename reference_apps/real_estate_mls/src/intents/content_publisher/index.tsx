/**
 * Content Publisher intent — reference implementation.
 *
 * The Content Publisher lets users publish a finished Canva design
 * directly to an external platform — for example, posting a property
 * listing to a real-estate portal, sharing to social media, or
 * uploading to a CMS — all without leaving Canva.
 *
 * This file is a placeholder that wires up the full publish flow
 * without actually uploading anywhere. Replace `publishContent` with
 * your own API call to make it real.
 *
 * How it works — Canva drives the flow by calling four callbacks:
 *
 *  1. `getPublishConfiguration` — tell Canva what you accept (file
 *     formats, aspect ratios, number of images, etc.).
 *  2. `renderSettingsUi` — show a form where the user adds metadata
 *     like a caption or tags before publishing.
 *  3. `renderPreviewUi` — show the user a preview of how the post
 *     will look on your platform.
 *  4. `publishContent` — receive the exported media + settings and
 *     upload them to your platform. Return the live URL.
 *
 * @see https://www.canva.dev/docs/apps/content-publisher/
 */
import "@canva/app-ui-kit/styles.css";
import { AppI18nProvider, initIntl } from "@canva/app-i18n-kit";
import { AppUiProvider } from "@canva/app-ui-kit";
import type {
  ContentPublisherIntent,
  GetPublishConfigurationResponse,
  PublishContentRequest,
  PublishContentResponse,
  RenderPreviewUiRequest,
  RenderSettingsUiRequest,
} from "@canva/intents/content";
import { createRoot } from "react-dom/client";
import { SettingUi } from "./setting_ui";
import { PreviewUi } from "./preview_ui";

const intl = initIntl();

// TODO: Define your own output types — each one represents a publishing
// format (e.g. "Instagram Post", "Blog Header"). Configure the mediaSlots
// to match your platform's accepted file types, dimensions, and counts.
async function getPublishConfiguration(): Promise<GetPublishConfigurationResponse> {
  return {
    status: "completed",
    outputTypes: [
      {
        id: "listing",
        displayName: intl.formatMessage({
          defaultMessage: "Listing Post",
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
                aspectRatio: { min: 4 / 5, max: 1.91 / 1 },
              },
            },
          },
        ],
      },
    ],
  };
}

function renderSettingsUi(request: RenderSettingsUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <SettingUi {...request} />
      </AppUiProvider>
    </AppI18nProvider>,
  );
}

function renderPreviewUi(request: RenderPreviewUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <PreviewUi {...request} />
      </AppUiProvider>
    </AppI18nProvider>,
  );
}

// TODO: Replace this stub with your actual publishing logic. A real
// implementation would:
//  1. Parse the user's settings from `request.publishRef`
//  2. Read the exported media from `request.media`
//  3. Upload to your platform's API
//  4. Return the live URL in `externalUrl`
//
// This placeholder returns a dummy URL to demonstrate the flow.
async function publishContent(
  _request: PublishContentRequest,
): Promise<PublishContentResponse> {
  return {
    status: "completed",
    externalId: `listing-${Date.now()}`,
    externalUrl: "https://example.com/listings/published",
  };
}

const contentPublisher: ContentPublisherIntent = {
  renderSettingsUi,
  renderPreviewUi,
  getPublishConfiguration,
  publishContent,
};

export default contentPublisher;

if (module.hot) {
  module.hot.accept(["./setting_ui", "./preview_ui"]);
}
