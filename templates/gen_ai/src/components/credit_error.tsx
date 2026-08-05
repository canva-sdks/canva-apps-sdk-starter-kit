import type { ReactNode } from "react";
import { Alert, Link } from "@canva/app-ui-kit";
import { getPlatformInfo } from "@canva/platform";
import { useIntl } from "react-intl";
import { APP_NAME, PURCHASE_URL } from "src/config";
import { CreditsErrorType } from "src/context/error_type";
import { useAppContext } from "src/context/use_app_context";
import { openExternalUrl } from "src/utils/open_external_url";
import { CreditErrorMessages as Messages } from "./credit_error.messages";

const getCreditsErrorMessage = (
  errorType: CreditsErrorType,
  intl: ReturnType<typeof useIntl>,
  canAcceptPayments: boolean,
): ReactNode => {
  if (errorType === CreditsErrorType.NotEnoughCredits) {
    return intl.formatMessage(Messages.alertNotEnoughCredits, {
      appName: APP_NAME,
      strong: (chunk) => <strong>{chunk}</strong>,
      link: (chunks) => (
        <Link
          href={PURCHASE_URL}
          requestOpenExternalUrl={() => openExternalUrl(PURCHASE_URL)}
          tooltipLabel={intl.formatMessage(Messages.purchaseLinkTooltip)}
          disabled={!canAcceptPayments}
        >
          {chunks}
        </Link>
      ),
    });
  } else {
    return null;
  }
};

export const CreditError = () => {
  const { loadingApp, creditsError } = useAppContext();
  const intl = useIntl();
  const platformInfo = getPlatformInfo();
  const { canAcceptPayments } = platformInfo;

  if (loadingApp || creditsError === CreditsErrorType.None) {
    return null;
  }

  return (
    <Alert tone="info">
      {getCreditsErrorMessage(creditsError, intl, canAcceptPayments)}
    </Alert>
  );
};
