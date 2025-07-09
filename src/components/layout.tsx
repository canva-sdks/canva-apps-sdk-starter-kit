import React from "react";
import { Box, Rows, Title } from "@canva/app-ui-kit";
import { FormattedMessage } from "react-intl";
import { useQrWorkflow } from "../hooks/use_qr_workflow";

// Input components
import { CsvUploader, RawTextArea, QrSizeControls } from "./inputs";

// Button components
import {
  GenerateButton,
  PlaceFirstButton,
  CreatePagesButton,
  RetryButton,
  ResetButton,
} from "./buttons";

// Banner components
import { DonationBanner, StatusMessage, FailedPagesAlert } from "./banners";

export function Layout() {
  const { state, actions } = useQrWorkflow();

  return (
    <Box padding="2u">
      <Rows spacing="2u">
        <Title>
          <FormattedMessage
            defaultMessage="Bulk QR Page Generator"
            description="Main heading / app name"
          />
        </Title>

        <FormattedMessage
          defaultMessage="Create QR codes in bulk and add them to your design. Position the first QR code manually, then generate pages for the rest."
          description="Help text explaining the app functionality"
          tagName="p"
        />

        {/* Input Section */}
        <Rows spacing="1u">
          <RawTextArea
            value={state.rawInput}
            onChange={actions.setRawInput}
            readOnly={state.firstQrPlaced}
          />

          <CsvUploader
            onFileUpload={actions.parseCsvFile}
            disabled={state.busy || state.firstQrPlaced}
          />
        </Rows>

        {/* QR Size Configuration - only show if no QR placed yet */}
        <QrSizeControls
          qrSize={state.qrSize}
          onChange={actions.setQrSize}
          visible={!state.firstQrPlaced}
        />

        {/* Status Messages */}
        <StatusMessage
          codes={state.codes}
          firstQrPlaced={state.firstQrPlaced}
          detectedPosition={state.detectedPosition}
        />

        {/* Action Buttons */}
        <Rows spacing="1u">
          {!state.firstQrPlaced && (
            <>
              <GenerateButton
                disabled={state.busy || !state.rawInput.trim()}
                onClick={actions.generateQrCodes}
                loading={state.busy}
              />

              <PlaceFirstButton
                disabled={state.busy || state.codes.length === 0}
                onClick={actions.addFirstQrToPage}
                loading={state.busy}
              />
            </>
          )}

          {state.firstQrPlaced && (
            <>
              <CreatePagesButton
                disabled={state.busy}
                onClick={actions.detectPositionAndCreatePages}
                loading={state.busy}
                count={state.codes.length - 1}
              />

              <RetryButton
                disabled={state.busy || state.isRetrying}
                onClick={actions.retryFailedPages}
                loading={state.isRetrying}
                count={state.failedPages.length}
                visible={state.failedPages.length > 0}
              />

              <ResetButton
                disabled={state.busy}
                onClick={actions.resetWorkflow}
              />
            </>
          )}
        </Rows>

        {/* Donation Banner */}
        <DonationBanner
          visible={state.showDonationBanner}
          onClose={() => actions.setShowDonationBanner(false)}
          onExternalUrlClick={actions.openExternalUrl}
        />

        {/* Failed Pages Alert */}
        <FailedPagesAlert failedPages={state.failedPages} />
      </Rows>
    </Box>
  );
} 