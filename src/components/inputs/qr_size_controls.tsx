import React from "react";
import { FormField, Slider, NumberInput, Rows, Title } from "@canva/app-ui-kit";
import { useIntl, FormattedMessage } from "react-intl";

interface QrSizeControlsProps {
  qrSize: { width: number; height: number };
  onChange: (size: { width: number; height: number }) => void;
  visible?: boolean;
}

export function QrSizeControls({ 
  qrSize, 
  onChange, 
  visible = true 
}: QrSizeControlsProps) {
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <Rows spacing="1u">
      <Title size="small">
        <FormattedMessage
          defaultMessage="QR Code Size"
          description="Sub‑heading for size controls"
        />
      </Title>

      <Rows spacing="2u">
        {/* Width Control */}
        <FormField
          label={intl.formatMessage({
            defaultMessage: "Width",
            description: "Width label",
          })}
          value={qrSize.width}
          control={() => (
            <Rows spacing="0.5u">
              <Slider
                min={50}
                max={800}
                step={10}
                value={qrSize.width}
                onChange={(value) =>
                  onChange({ ...qrSize, width: value })
                }
              />
              <NumberInput
                value={qrSize.width}
                onChange={(value) =>
                  onChange({ ...qrSize, width: value || 50 })
                }
                min={50}
                max={800}
                placeholder="px"
              />
            </Rows>
          )}
        />

        {/* Height Control */}
        <FormField
          label={intl.formatMessage({
            defaultMessage: "Height",
            description: "Height label",
          })}
          value={qrSize.height}
          control={() => (
            <Rows spacing="0.5u">
              <Slider
                min={50}
                max={800}
                step={10}
                value={qrSize.height}
                onChange={(value) =>
                  onChange({ ...qrSize, height: value })
                }
              />
              <NumberInput
                value={qrSize.height}
                onChange={(value) =>
                  onChange({ ...qrSize, height: value || 50 })
                }
                min={50}
                max={800}
                placeholder="px"
              />
            </Rows>
          )}
        />
      </Rows>
    </Rows>
  );
} 