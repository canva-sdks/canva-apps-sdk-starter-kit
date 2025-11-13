import type { Preview } from "@canva/intents/content";

// Type definition for publish settings
// In production, extend this to include all platform-specific settings
export interface PublishSettings {
  caption: string;
}

// Utility function to safely parse publish settings
export function parsePublishSettings(
  publishRef?: string,
): PublishSettings | undefined {
  if (!publishRef) return undefined;

  try {
    return JSON.parse(publishRef) as PublishSettings;
  } catch {
    return undefined;
  }
}

// Type guard to check if a preview is an image preview that's ready to display
export function isImagePreviewReady(preview: Preview): preview is Preview & {
  kind: "image";
  status: "ready";
  url: string;
} {
  return (
    preview.kind === "image" && preview.status === "ready" && "url" in preview
  );
}
