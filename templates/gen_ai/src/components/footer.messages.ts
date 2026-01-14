import { defineMessages } from "react-intl";

export const FooterMessages = defineMessages({
  /** Indicates actions users can take or instructions provided to the user. */
  generateAgain: {
    defaultMessage: "Generate again",
    description:
      "A button label to generate another image based on the previous prompt",
  },
  generateImage: {
    defaultMessage: "Generate image",
    description: "A button label to generate an image from a prompt",
  },
  purchaseMoreCredits: {
    defaultMessage: "Purchase more credits",
    description:
      "A button label to open a page where the user can purchase more credits",
  },
  startOver: {
    defaultMessage: "Start over",
    description: "A button label to start the image generation process over",
  },

  /** Messages related to handling errors that occur during operations. */
  appErrorGeneratingImagesFailed: {
    defaultMessage: "Generating images has failed, please try again.",
    description:
      "A message to indicate that generating images has failed, but the user is able to make another attempt",
  },

  /** Messages related to prompts and user input validation. */
  promptMissingErrorMessage: {
    defaultMessage: "Please describe what you want to create",
    description:
      "An error message to indicate that the user did not supply a prompt to generate an image, and this has to be provided before generating",
  },
  promptNoCreditsRemaining: {
    defaultMessage: "No credits remaining.",
    description:
      "A message to indicate that the user has no credits remaining, and is unable to generate an image",
  },
  promptObscenityErrorMessage: {
    defaultMessage:
      "Something you typed may result in content that doesn’t meet our policies.",
    description:
      "An error message to indicate that the user typed something that may result in content that for example could be offensive or violent",
  },
});
