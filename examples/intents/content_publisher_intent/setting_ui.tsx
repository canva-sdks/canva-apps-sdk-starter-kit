import type {
  PublishSettingsSettingsUiContext,
  RenderSettingsUiRequest,
} from "@canva/intents/content";
import { FormField, Rows, Text, TextInput } from "@canva/app-ui-kit";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import * as styles from "styles/components.css";
import type { PublishSettings } from "./types";

// Settings UI component for configuring publish settings
export const SettingUi = ({
  updatePublishSettings,
  registerOnContextChange,
}: RenderSettingsUiRequest) => {
  const intl = useIntl();
  const [settings, setSettings] = useState<PublishSettings>({
    caption: "",
  });
  const [settingsUiContext, setSettingsUiContext] =
    useState<PublishSettingsSettingsUiContext | null>(null);

  // Listen for settings UI context changes (e.g., when output type changes)
  useEffect(() => {
    const dispose = registerOnContextChange({
      onContextChange: (context) => {
        if (context.reason !== "publish_settings") return;
        setSettingsUiContext(context);
      },
    });
    return dispose;
  }, [registerOnContextChange]);

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
        <Text>{settingsUiContext?.outputType.displayName}</Text>
        <FormField
          label={intl.formatMessage({
            defaultMessage: "Caption",
            description:
              "Label for the caption input field in publish settings",
          })}
          control={(props) => (
            <TextInput
              {...props}
              value={settings.caption}
              onChange={(caption) =>
                setAndPropagateSettings({ ...settings, caption })
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
