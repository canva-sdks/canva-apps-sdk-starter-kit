import React from "react";
import { Button } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

interface CreatePagesButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  count: number;
}

export function CreatePagesButton({ onClick, disabled, loading, count }: CreatePagesButtonProps) {
  const intl = useIntl();

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="primary"
      stretch
      loading={loading}
    >
      {intl.formatMessage(
        {
          defaultMessage: "3. Create {count} Additional Pages",
          description: "Step 3 button text",
        },
        { count },
      )}
    </Button>
  );
} 