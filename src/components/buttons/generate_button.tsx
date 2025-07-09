import React from "react";
import { Button } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function GenerateButton({ onClick, disabled, loading }: GenerateButtonProps) {
  const intl = useIntl();

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="primary"
      stretch
      loading={loading}
    >
      {intl.formatMessage({
        defaultMessage: "1. Generate QR Codes",
        description: "Step 1 button text",
      })}
    </Button>
  );
} 