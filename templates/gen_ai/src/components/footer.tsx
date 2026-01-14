import { Button, Rows } from "@canva/app-ui-kit";
import { getPlatformInfo } from "@canva/platform";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { purchaseCredits, queueImageGeneration } from "src/api";
import { RemainingCredits } from "src/components";
import { NUMBER_OF_IMAGES_TO_GENERATE } from "src/config";
import { useAppContext } from "src/context";
import { Paths } from "src/routes/paths";
import { getObsceneWords } from "src/utils";
import { FooterMessages as Messages } from "./footer.messages";

export const Footer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRootRoute = pathname === Paths.HOME;
  const platformInfo = getPlatformInfo();
  const {
    setAppError,
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

  const hasRemainingCredits = remainingCredits > 0;

  const isCreditRemaining = () => {
    if (!hasRemainingCredits) {
      setPromptInputError(
        intl.formatMessage(Messages.promptNoCreditsRemaining),
      );
      return false;
    }
    return true;
  };

  const isPromptInputFilled = () => {
    if (!promptInput) {
      setPromptInputError(
        intl.formatMessage(Messages.promptMissingErrorMessage),
      );
      return false;
    }
    return true;
  };

  const isPromptInputClean = () => {
    const obsceneWords = getObsceneWords(promptInput);
    if (obsceneWords.length > 0) {
      setPromptInputError(
        intl.formatMessage(Messages.promptObscenityErrorMessage),
      );
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

    setIsLoadingImages(true);
    try {
      const { jobId } = await queueImageGeneration({
        prompt: promptInput,
        numberOfImages: NUMBER_OF_IMAGES_TO_GENERATE,
      });

      setJobId(jobId);
    } catch {
      setAppError(intl.formatMessage(Messages.appErrorGeneratingImagesFailed));
    }
    navigate(Paths.RESULTS);
  };

  const onPurchaseMoreCredits = async () => {
    if (!platformInfo.canAcceptPayments) {
      return;
    }

    const { credits } = await purchaseCredits();
    setRemainingCredits(credits);
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
      visible: hasRemainingCredits,
    },
    {
      variant: "primary" as const,
      onClick: onPurchaseMoreCredits,
      value: intl.formatMessage(Messages.purchaseMoreCredits),
      visible: !hasRemainingCredits,
      disabled: !platformInfo.canAcceptPayments,
      tooltip: intl.formatMessage({
        defaultMessage: "Payment not available on this platform.",
        description:
          "Tooltip text when payment functionality is not available on the current platform. ",
      }),
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
    <Rows spacing="1u">
      {footerButtons.map(
        ({ visible, variant, onClick, value, disabled, tooltip }) =>
          visible && (
            <Button
              key={value}
              variant={variant}
              onClick={onClick}
              loading={loadingApp}
              stretch={true}
              disabled={disabled}
              tooltipLabel={tooltip}
            >
              {value}
            </Button>
          ),
      )}
      <RemainingCredits />
    </Rows>
  );
};
