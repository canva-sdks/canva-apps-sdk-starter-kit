import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity";

/**
 * Retrieves a list of obscene words from the given input string.
 * @param {string} input The input string to search for obscene words.
 * @returns {string[]} An array of unique obscene words found in the input string.
 */
export const getObsceneWords = (input: string): string[] => {
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  // Find all matches in the input string, sorted by their position.
  const matches = matcher.getAllMatches(input, true);

  const obsceneWords: string[] = [];

  for (const match of matches) {
    const { phraseMetadata } =
      englishDataset.getPayloadWithPhraseMetadata(match);
    if (phraseMetadata?.originalWord) {
      obsceneWords.push(phraseMetadata.originalWord);
    }
  }

  // Return an array of unique obscene words.
  return [...new Set(obsceneWords)];
};
