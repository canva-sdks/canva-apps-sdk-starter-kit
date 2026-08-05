import { Alert, Link, Rows, Text, TextPlaceholder } from "@canva/app-ui-kit";
import { getPlatformInfo } from "@canva/platform";
import type { JSX } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { APP_NAME, PURCHASE_URL } from "src/config";
import { AppErrorType } from "src/context/error_type";
import { useAppContext } from "src/context/use_app_context";
import { openExternalUrl } from "src/utils/open_external_url";

const RemainingCreditsText = ({
  remainingCredits,
  loadingApp,
  appError,
}: {
  remainingCredits: number;
  loadingApp: boolean;
  appError: AppErrorType;
}) => {
  if (loadingApp) {
    return <TextPlaceholder size="small" />;
  }

  if (appError === AppErrorType.GetRemainingCreditsFailed) {
    return (
      <Text alignment="center" size="small">
        <FormattedMessage
          defaultMessage="<strong>Couldn't load your {appName} credits.</strong>"
          description="A message shown when the user's remaining credits failed to load"
          values={{
            appName: APP_NAME,
            strong: (chunks) => <strong>{chunks}</strong>,
          }}
        />
      </Text>
    );
  }

  return (
    <Text alignment="center" size="small">
      {remainingCredits > 0 ? (
        <FormattedMessage
          defaultMessage="Use <strong>1 of {remainingCredits, number}</strong> {
              remainingCredits, plural, one {{appName} credit}
              other {{appName} credits}
            }."
          description="A message to indicate the number of credits, of their total remaining credits, that will be used when generating an image. The app name is the name of the app, and is not translated."
          values={{
            remainingCredits,
            appName: APP_NAME,
            strong: (chunks) => <strong>{chunks}</strong>,
          }}
        />
      ) : (
        <FormattedMessage
          defaultMessage="Use <strong>1 of 0</strong> {appName} credits."
          description="A message to indicate that there are no credits available to be used"
          values={{
            appName: APP_NAME,
            strong: (chunks) => <strong>{chunks}</strong>,
          }}
        />
      )}
    </Text>
  );
};

export const RemainingCredits = (): JSX.Element | undefined => {
  const { remainingCredits, loadingApp, appError } = useAppContext();
  const platformInfo = getPlatformInfo();
  const intl = useIntl();

  return (
    <Rows spacing="1u">
      <Rows spacing="0">
        <RemainingCreditsText
          remainingCredits={remainingCredits}
          loadingApp={loadingApp}
          appError={appError}
        />
        <Text alignment="center" size="small">
          <FormattedMessage
            defaultMessage="Need more? <link>Buy {appName} credits</link>"
            description="A message to prompt the user to purchase more credits. Do not translate <link>example.com</link>."
            values={{
              appName: APP_NAME,
              link: (chunks) => (
                <Link
                  href={PURCHASE_URL}
                  requestOpenExternalUrl={() => openExternalUrl(PURCHASE_URL)}
                  disabled={!platformInfo.canAcceptPayments}
                  tooltipLabel={intl.formatMessage({
                    defaultMessage: "Example Co. website",
                    description:
                      "A title for a link to the website of Example Co.",
                  })}
                >
                  {chunks}
                </Link>
              ),
            }}
          />
        </Text>
      </Rows>

      {!platformInfo.canAcceptPayments && (
        <Alert tone="warn">
          <FormattedMessage
            defaultMessage="<strong>{appName} credits can only be purchased in a web browser.</strong> Sign in to canva.com and open {appName} again."
            description="A message shown when platform doesn't allow external payment links"
            values={{
              appName: APP_NAME,
              strong: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        </Alert>
      )}
    </Rows>
  );
};
