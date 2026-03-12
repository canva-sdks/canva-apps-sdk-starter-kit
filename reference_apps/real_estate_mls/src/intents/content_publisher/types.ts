import type { Preview } from "@canva/intents/content";

// TODO: Add fields for any platform-specific settings the user can
// configure before publishing (e.g. title, tags, visibility). These
// are serialized to `publishRef` (an opaque JSON string) by the settings
// UI and restored when the settings UI reopens or in `publishContent`.
export interface PublishSettings {
  caption: string;
}

// Safely parse `publishRef` back into PublishSettings. Returns undefined
// if the ref is missing or contains invalid JSON, so callers can fall
// back to defaults.
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

export function isImagePreviewReady(preview: Preview): preview is Preview & {
  kind: "image";
  status: "ready";
  url: string;
} {
  return (
    preview.kind === "image" && preview.status === "ready" && "url" in preview
  );
}
