import type {
  PublishSettingsSettingsUiContext,
  RenderSettingsUiRequest,
} from "@canva/intents/content";
import {
  Box,
  FormField,
  MultilineInput,
  Rows,
  Scrollable,
  Text,
} from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import type { PublishSettings } from "./types";

/**
 * Settings UI for the Content Publisher intent.
 *
 * Canva renders this panel so the user can configure how their design
 * will be published.
 *
 * `registerOnContextChange` lets us listen for external changes (e.g.
 * the user picking a different output type) and update the UI accordingly.
 */
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

  // Listen for context changes from Canva (e.g. the user selects a
  // different output type). The callback fires whenever the context
  // updates; we filter for "publish_settings" to ignore unrelated events.
  useEffect(() => {
    const dispose = registerOnContextChange({
      onContextChange: (context) => {
        if (context.reason !== "publish_settings") return;
        setSettingsUiContext(context);
      },
    });
    return dispose;
  }, [registerOnContextChange]);

  // Persist settings to Canva as a JSON string (`publishRef`) and report
  // whether the current state is valid. Canva stores publishRef and passes
  // it back to `publishContent` and the preview UI.
  function setAndPropagateSettings(updatedSettings: PublishSettings) {
    setSettings(updatedSettings);
    updatePublishSettings({
      publishRef: JSON.stringify(updatedSettings),
      validityState: validatePublishRef(updatedSettings),
    });
  }

  return (
    <Scrollable>
      <Box paddingY="2u" paddingEnd="2u">
        <Rows spacing="2u">
          <Text>{settingsUiContext?.outputType.displayName}</Text>
          <FormField
            label={intl.formatMessage({
              defaultMessage: "Caption",
              description:
                "Label for the caption input field in publish settings",
            })}
            control={(props) => (
              <MultilineInput
                {...props}
                value={settings.caption}
                onChange={(caption) =>
                  setAndPropagateSettings({ ...settings, caption })
                }
                placeholder={intl.formatMessage({
                  defaultMessage: "Write a caption for your listing post...",
                  description: "Placeholder text for publish caption input",
                })}
              />
            )}
          />
        </Rows>
      </Box>
    </Scrollable>
  );
};

function validatePublishRef(settings: PublishSettings) {
  if (settings.caption.length === 0) {
    return "invalid_missing_required_fields" as const;
  }
  return "valid" as const;
}
