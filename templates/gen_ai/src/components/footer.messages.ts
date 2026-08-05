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
  resetCredits: {
    defaultMessage: "Reset credits",
    description:
      "A button label to reset the template's demo credits, as a stand-in for a real purchase flow",
  },
  resetCreditsMessage: {
    defaultMessage:
      "Reset the template’s demo credits. Remove this when you connect your app to your credit system.",
    description: "A description of the reset credits button function",
  },
  demoOnly: {
    defaultMessage: "Demo only",
    description: "A label to indicate that the button is for demo purposes",
  },
  startOver: {
    defaultMessage: "Start over",
    description: "A button label to start the image generation process over",
  },
});
