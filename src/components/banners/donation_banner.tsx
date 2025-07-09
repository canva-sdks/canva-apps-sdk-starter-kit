import React from "react";
import { Alert, Button, Columns, Column, Link, Rows, Text, ImageCard } from "@canva/app-ui-kit";
import { FormattedMessage } from "react-intl";
import { bmcQr } from "../../assets";

interface DonationBannerProps {
  visible: boolean;
  onClose: () => void;
  onExternalUrlClick: (url: string) => Promise<void>;
}

export function DonationBanner({ 
  visible, 
  onClose, 
  onExternalUrlClick 
}: DonationBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <Alert tone="info">
      <Rows spacing="1.5u">
        {/* Header with title and close button */}
        <Columns spacing="1u" alignY="center">
          <Column>
            <Text>
              <FormattedMessage
                defaultMessage="🎉 Great work! Tool completed successfully."
                description="Donation banner title"
              />
            </Text>
          </Column>
          <Column width="content">
            <Button 
              variant="tertiary" 
              onClick={onClose}
            >
              ✕
            </Button>
          </Column>
        </Columns>
        
        {/* Main content */}
        <Columns spacing="2u" alignY="center">
          {/* QR Code */}
          <Column width="content">
            <ImageCard
              ariaLabel="Buy Me a Coffee QR Code"
              alt="Buy Me a Coffee QR Code"
              thumbnailUrl={bmcQr}
              onClick={() => {}} // No action needed for this image
              selectable={false}
            />
          </Column>
          
          {/* Text content */}
          <Column>
            <Rows spacing="0.5u">
              <Text size="small">
                <FormattedMessage
                  defaultMessage="If this tool was helpful, consider supporting its development:"
                  description="Donation banner subtitle"
                />
              </Text>
              
              <Text>
                ☕{" "}
                <Link
                  href="https://coff.ee/giuseppedichiara"
                  requestOpenExternalUrl={() => onExternalUrlClick("https://coff.ee/giuseppedichiara")}
                  title="Support development - Buy me a coffee"
                >
                  <FormattedMessage
                    defaultMessage="Buy me a coffee"
                    description="Donation link text"
                  />
                </Link>
              </Text>
              
              <Text size="small">
                <FormattedMessage
                  defaultMessage="Scan QR code or click the link above"
                  description="Donation instruction text"
                />
              </Text>
            </Rows>
          </Column>
        </Columns>
      </Rows>
    </Alert>
  );
} 