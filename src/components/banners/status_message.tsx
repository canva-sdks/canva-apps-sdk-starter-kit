import React from "react";
import { Text, Rows } from "@canva/app-ui-kit";
import { FormattedMessage } from "react-intl";
import type { DetectedPosition } from "../../types/qr";

interface StatusMessageProps {
  codes: any[];
  firstQrPlaced: boolean;
  detectedPosition: DetectedPosition | null;
}

export function StatusMessage({ codes, firstQrPlaced, detectedPosition }: StatusMessageProps) {
  // QR codes ready message
  if (codes.length > 0 && !firstQrPlaced) {
    return (
      <Text size="small">
        <FormattedMessage
          defaultMessage="{count} QR codes ready. Place the first one on the page to continue."
          description="Status text showing generated QR count"
          values={{ count: codes.length }}
        />
      </Text>
    );
  }

  // Position detection success message
  if (firstQrPlaced && detectedPosition) {
    return (
      <Text size="small">
        <FormattedMessage
          defaultMessage="✅ First QR positioned at: Top {top}px, Left {left}px (Size: {width}×{height}px)"
          description="Position detection success message"
          values={{
            top: detectedPosition.top,
            left: detectedPosition.left,
            width: detectedPosition.width,
            height: detectedPosition.height,
          }}
        />
      </Text>
    );
  }

  // First QR placed but no position detected yet
  if (firstQrPlaced && !detectedPosition) {
    return (
      <Rows spacing="0.5u">
        <Text size="small">
          <FormattedMessage
            defaultMessage="First QR code placed! Move it to your desired position, then click 'Create Additional Pages'."
            description="Status text after first QR placement"
          />
        </Text>
        <Text size="small">
          <FormattedMessage
            defaultMessage="📝 Note: New pages will contain only the QR code at the detected position. Other elements from this page need to be manually copied if needed."
            description="Information about page duplication limitations"
          />
        </Text>
      </Rows>
    );
  }

  return null;
} 