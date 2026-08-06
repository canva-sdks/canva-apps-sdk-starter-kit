import type { ReactNode } from "react";
import { Alert, Link } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { AppErrorType } from "src/context/error_type";
import { useAppContext } from "src/context/use_app_context";
import { openExternalUrl } from "src/utils/open_external_url";
import { AppErrorMessages as Messages } from "./app_error.messages";
import { APP_NAME } from "src/config";

const POLICY_URL = "https://www.canva.com/policies/acceptable-use-policy/";

const getAppErrorMessage = (
  errorType: AppErrorType,
  intl: ReturnType<typeof useIntl>,
): ReactNode => {
  if (errorType === AppErrorType.General) {
    return intl.formatMessage(Messages.appErrorGeneral);
  } else if (errorType === AppErrorType.GetRemainingCreditsFailed) {
    return intl.formatMessage(Messages.appErrorGetRemainingCreditsFailed, {
      strong: (chunks) => <strong>{chunks}</strong>,
      appName: APP_NAME,
    });
  } else if (errorType === AppErrorType.GeneratingImagesFailed) {
    return intl.formatMessage(Messages.appErrorGeneratingImagesFailed, {
      strong: (chunks) => <strong>{chunks}</strong>,
    });
  } else if (errorType === AppErrorType.PromptObscenity) {
    return intl.formatMessage(Messages.promptObscenityErrorMessage, {
      strong: (chunks) => <strong>{chunks}</strong>,
      link: (chunks) => (
        <Link
          href={POLICY_URL}
          requestOpenExternalUrl={() => openExternalUrl(POLICY_URL)}
        >
          {chunks}
        </Link>
      ),
    });
  } else {
    return null;
  }
};

export const AppError = () => {
  const { loadingApp, appError, setAppError } = useAppContext();
  const intl = useIntl();

  if (loadingApp || appError === AppErrorType.None) {
    return null;
  }

  return (
    <Alert tone="critical" onDismiss={() => setAppError(AppErrorType.None)}>
      {getAppErrorMessage(appError, intl)}
    </Alert>
  );
};
