import React from "react";
import { Button } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

interface PlaceFirstButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function PlaceFirstButton({ onClick, disabled, loading }: PlaceFirstButtonProps) {
  const intl = useIntl();

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="secondary"
      stretch
      loading={loading}
    >
      {intl.formatMessage({
        defaultMessage: "2. Place First QR Code",
        description: "Step 2 button text",
      })}
    </Button>
  );
} 