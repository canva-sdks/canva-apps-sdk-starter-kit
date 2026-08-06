import { defineMessages } from "react-intl";

export const PromptInputMessages = defineMessages({
  /** Messages related to prompts and user input validation. */
  promptInspireMe: {
    defaultMessage: "Inspire me",
    description:
      "A button label to generate a prompt automatically, which may inspire the user to write their own",
  },
  promptTryAnother: {
    defaultMessage: "Inspire again",
    description: "A button label to try another image generation prompt",
  },
  promptMissingErrorMessage: {
    defaultMessage: "Please describe what you'd like to create",
    description:
      "An error message to indicate that the user did not supply a prompt to generate an image, and this has to be provided before generating",
  },

  /**
   * Example prompts offered via the "Inspire me" button to spark ideas for
   * what the user could ask the AI image generator to create.
   */
  examplePromptCatsParallelUniverse: {
    defaultMessage: "Cats ruling a parallel universe",
    description:
      "An example image generation prompt depicting cats as rulers of an alternate reality",
  },
  examplePromptFuturisticCityRobots: {
    defaultMessage: "Futuristic city with friendly robots",
    description:
      "An example image generation prompt depicting a futuristic cityscape alongside approachable, non-threatening robots",
  },
  examplePromptMagicalForestUnicorns: {
    defaultMessage: "Magical forest with unicorns and dragons",
    description:
      "An example image generation prompt depicting a fantasy forest inhabited by mythical creatures such as unicorns and dragons",
  },
  examplePromptUnderwaterKingdom: {
    defaultMessage: "Underwater kingdom with colorful fish and mermaids",
    description:
      "An example image generation prompt depicting an underwater fantasy realm featuring mermaids and vibrant marine life",
  },
  examplePromptAlteredGravity: {
    defaultMessage: "World with altered gravity and flying people",
    description:
      "An example image generation prompt depicting a world where the normal rules of gravity don't apply, letting people float or fly",
  },
  examplePromptAlienLandscape: {
    defaultMessage: "Alien landscape with strange creatures",
    description:
      "An example image generation prompt depicting an extraterrestrial, otherworldly environment populated by unfamiliar lifeforms",
  },
  examplePromptSteampunkAirship: {
    defaultMessage: "Steampunk adventure on a giant airship",
    description:
      "An example image generation prompt depicting a steampunk-styled scene (Victorian-era aesthetic combined with steam-powered machinery) set aboard a large airship",
  },
  examplePromptWhimsicalTeaParty: {
    defaultMessage: "Whimsical tea party with talking animals",
    description:
      "An example image generation prompt depicting a tea party attended by anthropomorphic, talking animals",
  },
  examplePromptCyberpunkCityscape: {
    defaultMessage: "Cyberpunk cityscape with neon lights",
    description:
      "An example image generation prompt depicting a cyberpunk-styled city scene characterized by neon lighting and a high-tech, dystopian tone",
  },
  examplePromptPostApocalypticWorld: {
    defaultMessage: "Post-apocalyptic world reclaimed by nature",
    description:
      "An example image generation prompt depicting an abandoned, post-disaster world where plant life and nature have overgrown human structures",
  },
  examplePromptMagicalLibrary: {
    defaultMessage: "Magical library where books come to life",
    description:
      "An example image generation prompt depicting an enchanted library in which books and their contents animate and interact with their surroundings",
  },
  examplePromptSpaceStation: {
    defaultMessage: "Space station orbiting a distant planet",
    description:
      "An example image generation prompt depicting a space station in orbit around a planet far from Earth",
  },
  examplePromptTimeTravelingAdventure: {
    defaultMessage: "Time-traveling adventure through historical eras",
    description:
      "An example image generation prompt depicting a journey that moves across multiple distinct historical time periods",
  },
  examplePromptEnchantedGarden: {
    defaultMessage: "Enchanted garden where flowers sing and dance",
    description:
      "An example image generation prompt depicting a magical garden in which flowers are personified, singing and dancing",
  },
  examplePromptFantasyCastle: {
    defaultMessage: "Fantasy castle floating among clouds",
    description:
      "An example image generation prompt depicting a fairy-tale-style castle suspended in the sky, surrounded by clouds",
  },
  examplePromptFairytaleScene: {
    defaultMessage: "Fairytale scene with magical objects",
    description:
      "An example image generation prompt depicting a classic fairy-tale setting featuring enchanted or magical objects",
  },
  examplePromptCosmicJourney: {
    defaultMessage: "Cosmic journey through distant galaxies",
    description:
      "An example image generation prompt depicting travel through outer space across far-off galaxies, evoking a sense of vastness and wonder",
  },
  examplePromptHalloweenWorld: {
    defaultMessage: "World where every day is Halloween",
    description:
      "An example image generation prompt depicting a setting permanently themed around Halloween imagery and atmosphere",
  },
  examplePromptFuturisticSportsArena: {
    defaultMessage: "Futuristic sports arena with cyborgs",
    description:
      "An example image generation prompt depicting a high-tech sports venue in which the competitors are part-machine, part-human cyborgs",
  },
  examplePromptMythOrLegend: {
    defaultMessage: "Scene inspired by a classic myth or legend",
    description:
      "An example image generation prompt inviting a scene based on well-known mythology or folklore, without specifying which one",
  },
});
