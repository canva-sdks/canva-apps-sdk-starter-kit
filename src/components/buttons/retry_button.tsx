import React from "react";
import { Button } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

interface RetryButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  count: number;
  visible?: boolean;
}

export function RetryButton({ 
  onClick, 
  disabled, 
  loading, 
  count,
  visible = true 
}: RetryButtonProps) {
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="secondary"
      stretch
      loading={loading}
    >
      {intl.formatMessage(
        {
          defaultMessage: "🔄 Retry {count} Failed Pages",
          description: "Retry failed pages button text",
        },
        { count },
      )}
    </Button>
  );
} 