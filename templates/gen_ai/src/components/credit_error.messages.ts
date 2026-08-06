import { defineMessages } from "react-intl";

export const CreditErrorMessages = defineMessages({
  alertNotEnoughCredits: {
    defaultMessage:
      "<strong>You don’t have enough {appName} credits.</strong>\n Generating requires at least 1 credit. To continue, <link>buy {appName} credits</link>",
    description:
      "A message to indicate that the user doesn't have enough credits to generate an image, and will need to buy more to continue",
  },
  purchaseLinkTooltip: {
    defaultMessage: "Example Co. website",
    description: "A title for a link to the website of Example Co.",
  },
});
