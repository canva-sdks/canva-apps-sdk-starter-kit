import { defineMessages } from "react-intl";

export const ContextMessages = defineMessages({
  /** Messages related to handling errors that occur during operations. */
  appErrorGeneral: {
    defaultMessage: "An unexpected error occurred. Please try again later.",
    description:
      "A message to indicate that an unexpected error occurred, but no more information is available",
  },
  appErrorGetRemainingCreditsFailed: {
    defaultMessage: "Retrieving remaining credits has failed.",
    description:
      "A message to indicate that there was a failure to get the number of credits the user has",
  },

  /** Messages related to prompts and user input validation. */
  promptMissingErrorMessage: {
    defaultMessage: "Please describe what you want to create",
    description:
      "An error message to indicate that the prompt was empty and should be supplied",
  },

  /** Messages related to credits, including their availability and purchasing options. */
  alertNotEnoughCredits: {
    defaultMessage:
      "You don’t have enough credits left to generate an image. Please purchase more.",
    description:
      "A message to indicate that the user doesn't have enough credits to generate an image, and will need to buy more to continue",
  },
});
