import React from "react";
import { FormField, MultilineInput } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

interface RawTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function RawTextArea({ value, onChange, readOnly = false }: RawTextAreaProps) {
  const intl = useIntl();

  return (
    <FormField
      label={intl.formatMessage({
        defaultMessage: "Text or URLs",
        description: "Label for text input field",
      })}
      value={value}
      control={(props) => (
        <MultilineInput
          {...props}
          placeholder={intl.formatMessage({
            defaultMessage:
              "https://example.com\nhttps://another.com\nOr any text content...",
            description: "Placeholder example for multiline input",
          })}
          onChange={(value) => onChange(value)}
          maxRows={6}
          readOnly={readOnly}
        />
      )}
    />
  );
} 