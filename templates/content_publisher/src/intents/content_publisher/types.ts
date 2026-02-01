/**
 * Type definition for publish settings.
 * These settings are serialized and passed between different parts of the publish flow.
 * In production, include all platform-specific settings needed for publishing.
 */
export interface PublishSettings {
  caption: string;
  // TODO: Add additional fields for your platform's publishing requirements
  // Examples:
  // scheduledTime: Date;
  // visibility: "public" | "private" | "unlisted";
  // tags: string[];
}

/**
 * Utility function to safely parse publish settings from a JSON string.
 * This is used to deserialize settings that were passed through the publish flow.
 */
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
