import React from "react";
import { Button } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

interface ResetButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function ResetButton({ onClick, disabled }: ResetButtonProps) {
  const intl = useIntl();

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="secondary"
      stretch
    >
      {intl.formatMessage({
        defaultMessage: "Start Over",
        description: "Reset button text",
      })}
    </Button>
  );
} 