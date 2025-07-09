import React from "react";
import { Text } from "@canva/app-ui-kit";
import { FormattedMessage } from "react-intl";
import type { FailedPage } from "../../types/qr";

interface FailedPagesAlertProps {
  failedPages: FailedPage[];
}

export function FailedPagesAlert({ failedPages }: FailedPagesAlertProps) {
  if (failedPages.length === 0) {
    return null;
  }

  return (
    <Text size="small" tone="critical">
      <FormattedMessage
        defaultMessage="⚠️ {count} {count, plural, =1 {page} other {pages}} failed to create. Use the retry button above to attempt creating them again."
        description="Status text showing failed pages count"
        values={{ count: failedPages.length }}
      />
    </Text>
  );
} 