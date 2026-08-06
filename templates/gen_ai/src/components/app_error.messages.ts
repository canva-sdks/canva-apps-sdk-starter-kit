import { defineMessages } from "react-intl";

export const AppErrorMessages = defineMessages({
  appErrorGeneral: {
    defaultMessage: "An unexpected error occurred. Please try again later.",
    description:
      "A message to indicate that an unexpected error occurred, but no more information is available",
  },
  appErrorGetRemainingCreditsFailed: {
    defaultMessage:
      "<strong>We couldn't retrieve your {appName} credits.</strong> Wait a few moments, then close and reopen the app to try again.",
    description:
      "A message to indicate that there was a failure to get the number of credits the user has. The user is able to try again later.",
  },
  appErrorGeneratingImagesFailed: {
    defaultMessage:
      "<strong>We couldn't generate your image.</strong> Wait a few moments, then try again.",
    description:
      "A message to indicate that generating images has failed, but the user is able to make another attempt",
  },
  promptObscenityErrorMessage: {
    defaultMessage:
      "<strong>The description may result in content that doesn’t meet our policies.</strong> Try again or learn more about our <link>Acceptable Use Policy</link>",
    description:
      "An error message to indicate that the user typed something that may result in content that for example could be offensive or violent",
  },
});
