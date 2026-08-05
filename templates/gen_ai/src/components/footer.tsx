import { Badge, Button, Rows, Text } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { purchaseCredits, queueImageGeneration } from "src/api/api";
import { RemainingCredits } from "src/components/remaining_credits";
import { NUMBER_OF_IMAGES_TO_GENERATE } from "src/config";
import {
  AppErrorType,
  CreditsErrorType,
  PromptInputErrorType,
} from "src/context/error_type";
import { useAppContext } from "src/context/use_app_context";
import { Paths } from "src/routes/paths";
import { getObsceneWords } from "src/utils/obscenity_filter";
import { FooterMessages as Messages } from "./footer.messages";
import { useEffect, useState } from "react";
import { getPlatformInfo } from "@canva/platform";

export const Footer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRootRoute = pathname === Paths.HOME;
  const platformInfo = getPlatformInfo();
  const {
    appError,
    setAppError,
    setCreditsError,
    promptInput,
    setPromptInput,
    setPromptInputError,
    loadingApp,
    isLoadingImages,
    setJobId,
    setIsLoadingImages,
    remainingCredits,
    setRemainingCredits,
  } = useAppContext();
  const intl = useIntl();

  const [isGenerateButtonActive, setIsGenerateButtonActive] = useState(true);
  const hasRemainingCredits = remainingCredits > 0;

  // Re-enables the button if credits become available again (e.g. after a
  // purchase flow updates remainingCredits).
  useEffect(() => {
    if (hasRemainingCredits) {
      setIsGenerateButtonActive(true);
    }
  }, [hasRemainingCredits]);

  const isCreditRemaining = () => {
    if (!hasRemainingCredits) {
      setIsGenerateButtonActive(false);
      setCreditsError(CreditsErrorType.NotEnoughCredits);
      return false;
    }
    return true;
  };

  const isPromptInputFilled = () => {
    if (!promptInput) {
      setPromptInputError(PromptInputErrorType.PromptMissing);
      return false;
    }
    return true;
  };

  const isPromptInputClean = () => {
    const obsceneWords = getObsceneWords(promptInput);
    if (obsceneWords.length > 0) {
      setAppError(AppErrorType.PromptObscenity);
      return false;
    }
    return true;
  };

  const onGenerateClick = async () => {
    if (
      !isCreditRemaining() ||
      !isPromptInputFilled() ||
      !isPromptInputClean()
    ) {
      return;
    }
    setAppError(AppErrorType.None);
    setIsLoadingImages(true);

    try {
      const { jobId } = await queueImageGeneration({
        prompt: promptInput,
        numberOfImages: NUMBER_OF_IMAGES_TO_GENERATE,
      });

      setJobId(jobId);
      navigate(Paths.RESULTS);
    } catch {
      setIsLoadingImages(false);
      setAppError(AppErrorType.GeneratingImagesFailed);
    }
  };

  const onPurchaseMoreCredits = async () => {
    if (!platformInfo.canAcceptPayments) {
      return;
    }

    try {
      const { credits } = await purchaseCredits();
      setRemainingCredits(credits);
    } catch {
      setAppError(AppErrorType.General);
    }
  };

  const reset = () => {
    setPromptInput("");
    navigate(Paths.HOME);
  };
  const footerButtons = [
    {
      variant: "primary" as const,
      onClick: onGenerateClick,
      value: isRootRoute
        ? intl.formatMessage(Messages.generateImage)
        : intl.formatMessage(Messages.generateAgain),
      visible: true,
      disabled: !isGenerateButtonActive,
    },
    {
      variant: "secondary" as const,
      onClick: reset,
      value: intl.formatMessage(Messages.startOver),
      visible: !isRootRoute,
    },
  ];

  if (isLoadingImages) {
    return null;
  }

  return (
    <Rows spacing="3u">
      <Rows spacing="1u">
        {footerButtons.map(
          ({ visible, variant, onClick, value, disabled }) =>
            visible && (
              <Button
                key={value}
                variant={variant}
                onClick={onClick}
                loading={loadingApp}
                stretch={true}
                disabled={disabled}
              >
                {value}
              </Button>
            ),
        )}
        <RemainingCredits />
      </Rows>

      {!hasRemainingCredits &&
        appError !== AppErrorType.GetRemainingCreditsFailed && (
          <Rows spacing="1u">
            <Button
              variant="secondary"
              onClick={onPurchaseMoreCredits}
              icon={() => (
                <Badge
                  tone="warn"
                  text={intl.formatMessage(Messages.demoOnly)}
                  ariaLabel={intl.formatMessage(Messages.demoOnly)}
                />
              )}
              iconPosition="end"
            >
              {intl.formatMessage(Messages.resetCredits)}
            </Button>
            <Text alignment="center" size="small">
              {intl.formatMessage(Messages.resetCreditsMessage)}
            </Text>
          </Rows>
        )}
    </Rows>
  );
};
