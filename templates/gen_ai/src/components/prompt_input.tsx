import {
  Box,
  Button,
  FormField,
  LightBulbIcon,
  MultilineInput,
} from "@canva/app-ui-kit";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useAppContext } from "src/context";
import { Paths } from "src/routes/paths";
import { PromptInputMessages as Messages } from "./prompt_input.messages";

// @TODO: Adjust according to your specific requirements.
const MAX_INPUT_LENGTH = 280;
const MIN_INPUT_ROWS = 3;

/**
 * Array of example prompts that could be used to generate interesting pictures with an AI.
 * Consider fetching these prompts from a server or API call for dynamic and varied content.
 * These would need to be localised, but that is left out here as the method would depend on
 * the specific implementation or API used.
 */
const examplePrompts: string[] = [
  "Cats ruling a parallel universe",
  "Futuristic city with friendly robots",
  "Magical forest with unicorns and dragons",
  "Underwater kingdom with colorful fish and mermaids",
  "World with altered gravity and flying people",
  "Alien landscape with strange creatures",
  "Steampunk adventure on a giant airship",
  "Whimsical tea party with talking animals",
  "Cyberpunk cityscape with neon lights",
  "Post-apocalyptic world reclaimed by nature",
  "Magical library where books come to life",
  "Space station orbiting a distant planet",
  "Time-traveling adventure through historical eras",
  "Enchanted garden where flowers sing and dance",
  "Fantasy castle floating among clouds",
  "Fairytale scene with magical objects",
  "Cosmic journey through distant galaxies",
  "World where every day is Halloween",
  "Futuristic sports arena with cyborgs",
  "Scene inspired by a classic myth or legend",
];

/**
 * Generates a new example prompt different from the current prompt.
 * @param {string} currentPrompt - The current prompt.
 * @returns {string} A new example prompt different from the current prompt.
 */
const generateExamplePrompt = (currentPrompt: string): string => {
  let newPrompt = currentPrompt;

  // Prevents generating the same prompt twice in a row.
  let attempts = 0;
  // Maximum attempts to generate a new prompt. Used as a safeguard against infinite loops.
  const MAX_ATTEMPTS = 3;

  while (currentPrompt === newPrompt && attempts < MAX_ATTEMPTS) {
    const randomPrompt =
      examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    if (randomPrompt) {
      newPrompt = randomPrompt;
    }
    attempts++;
  }

  return newPrompt;
};

export const PromptInput = () => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const isHomeRoute = pathname === Paths.HOME;
  const { promptInput, setPromptInput, promptInputError } = useAppContext();
  const [showInspireMeButton, setShowInspireMeButton] = useState(true);
  const [inspireMeButtonLabel, setInspireMeButtonLabel] = useState(
    intl.formatMessage(Messages.promptInspireMe),
  );

  const onInspireClick = () => {
    setPromptInput(generateExamplePrompt(promptInput));
    setInspireMeButtonLabel(intl.formatMessage(Messages.promptTryAnother));
  };

  const onPromptInputChange = (value: string) => {
    setShowInspireMeButton(false);
    setPromptInput(value);
  };

  const InspireMeButton = () => {
    return (
      <Button variant="secondary" icon={LightBulbIcon} onClick={onInspireClick}>
        {inspireMeButtonLabel}
      </Button>
    );
  };

  const onClearClick = () => {
    setPromptInput("");
    setShowInspireMeButton(true);
    setInspireMeButtonLabel(intl.formatMessage(Messages.promptInspireMe));
  };

  const ClearButton = () => (
    <Button variant="tertiary" onClick={onClearClick}>
      {intl.formatMessage({
        defaultMessage: "Clear",
        description:
          "A button label to remove all contents of the prompt input field",
      })}
    </Button>
  );

  return (
    <FormField
      label={intl.formatMessage({
        defaultMessage: "Describe what you want to create",
        description:
          "A label for the input field to describe what the user wants to create",
      })}
      error={promptInputError}
      value={promptInput}
      control={(props) => (
        <MultilineInput
          {...props}
          placeholder={intl.formatMessage({
            defaultMessage: "Enter 5+ words to describe...",
            description:
              "A placeholder for the input field where the user can describe what they want the AI image generator to create, encouraging them to use a longer, more descriptive phrase. The number of words is not validated, but a longer text will likely improve the quality of the results. Feel free to translate loosely or idiomatically.",
          })}
          onChange={onPromptInputChange}
          maxLength={MAX_INPUT_LENGTH}
          minRows={MIN_INPUT_ROWS}
          footer={
            <Box
              padding="1u"
              display="flex"
              justifyContent={
                isHomeRoute && showInspireMeButton ? "spaceBetween" : "end"
              }
            >
              {isHomeRoute && showInspireMeButton && <InspireMeButton />}
              {promptInput && <ClearButton />}
            </Box>
          }
          required={true}
        />
      )}
    />
  );
};
