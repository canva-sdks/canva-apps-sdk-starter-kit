import { FormField, Rows, Text, TextInput } from "@canva/app-ui-kit";
import type {
  PublishRefValidityState,
  RenderSettingsUiRequest,
  SettingsUiContext,
} from "@canva/intents/content";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import * as styles from "styles/components.css";
import type { PublishSettings } from "./types";

// Settings UI component for configuring publish settings
export const SettingsUi = ({
  updatePublishSettings,
  registerOnSettingsUiContextChange,
}: RenderSettingsUiRequest) => {
  const intl = useIntl();
  const [settings, setSettings] = useState<PublishSettings>({ caption: "" });
  const [settingsUiContext, setSettingsUiContext] =
    useState<SettingsUiContext | null>(null);

  // Listen for settings UI context changes (e.g., when output type changes)
  useEffect(() => {
    const dispose = registerOnSettingsUiContextChange((context) => {
      setSettingsUiContext(context);
    });
    return dispose;
  }, [registerOnSettingsUiContextChange]);

  // Helper function to both set the settings locally and propagate them to Canva
  const setAndPropagateSettings = useCallback(
    (updatedSettings: PublishSettings) => {
      setSettings(updatedSettings);
      updatePublishSettings({
        publishRef: JSON.stringify(updatedSettings),
        validityState: validatePublishRef(updatedSettings),
      });
    },
    [updatePublishSettings],
  );

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {settingsUiContext?.outputType.displayName && (
          <Text>{settingsUiContext?.outputType.displayName}</Text>
        )}
        <FormField
          label={intl.formatMessage({
            defaultMessage: "Caption",
            description: "Label for the caption input field",
          })}
          control={(props) => (
            <TextInput
              {...props}
              value={settings.caption}
              onChange={(caption) => {
                setAndPropagateSettings({ ...settings, caption });
              }}
            />
          )}
        />
      </Rows>
    </div>
  );
};

// Validates the publish settings to enable/disable the publish button
// Returns "valid" when all required fields are filled
const validatePublishRef = (
  publishRef: PublishSettings,
): PublishRefValidityState => {
  // caption is required
  if (publishRef.caption.length === 0) {
    return "invalid_missing_required_fields";
  }
  return "valid";
};
