type Placeholder = {
  height: number;
  width: number;
};

export function generatePlaceholders({
  numPlaceholders,
  height,
}: {
  numPlaceholders: number;
  height: number;
}): Placeholder[] {
  return Array.from({ length: numPlaceholders }, (_, i) => {
    // generate images such that width is 1-1.5x the height
    const width = Math.floor(height * (Math.random() * 0.5 + 1));

    return {
      height,
      width,
    };
  });
}
