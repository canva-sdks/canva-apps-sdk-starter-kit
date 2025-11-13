import type {
  RenderSettingsUiRequest,
  SettingsUiContext,
} from "@canva/intents/content";
import { FormField, Rows, Text, TextInput } from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import * as styles from "styles/components.css";
import type { PublishSettings } from "./types";

// Settings UI component for configuring publish settings
export const SettingUi = ({
  updatePublishSettings,
  registerOnSettingsUiContextChange,
}: RenderSettingsUiRequest) => {
  const [settings, setSettings] = useState<PublishSettings>({
    caption: "",
  });
  const [settingsUiContext, setSettingsUiContext] =
    useState<SettingsUiContext | null>(null);

  // Listen for settings UI context changes (e.g., when output type changes)
  useEffect(() => {
    const dispose = registerOnSettingsUiContextChange((context) => {
      setSettingsUiContext(context);
    });
    return dispose;
  }, [registerOnSettingsUiContextChange]);

  // Update publish settings whenever they change
  // This notifies Canva of the current settings and validity state
  useEffect(() => {
    updatePublishSettings({
      publishRef: JSON.stringify(settings),
      validityState: validatePublishRef(settings),
    });
  }, [settings, updatePublishSettings]);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>{settingsUiContext?.outputType.displayName}</Text>
        <FormField
          label="Caption"
          control={(props) => (
            <TextInput
              {...props}
              value={settings.caption}
              onChange={(caption) =>
                setSettings((prev) => ({ ...prev, caption }))
              }
            />
          )}
        />
      </Rows>
    </div>
  );
};

// Validates the publish settings to enable/disable the publish button
// Returns "valid" when all required fields are filled
const validatePublishRef = (publishRef: PublishSettings) => {
  // caption is required
  if (publishRef.caption.length === 0) {
    return "invalid_missing_required_fields";
  }
  return "valid";
};
