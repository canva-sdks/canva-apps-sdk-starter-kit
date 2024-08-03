import React from "react";
import { Rows, Text, Swatch, Title } from "@canva/app-ui-kit";
import { Color } from "@canva/preview/asset";
import { findRecoms } from "./utils";

type RecommendationsProps = {
    fgColour: string;
    bgColour: string;
  };
  
export const RecommendationsComponent: React.FC<RecommendationsProps> = ({ fgColour, bgColour }) => {
  const fgSwatches: JSX.Element[] = [];
  const bgSwatches: JSX.Element[] = [];

  const fgRecoms: Color[] = findRecoms(fgColour, bgColour);
  const bgRecoms: Color[] = findRecoms(bgColour, fgColour);

  // TODO put code for finding recommendations here

  for (const fgColour of fgRecoms) {
    fgSwatches.push(
      <Swatch
        fill={[fgColour.hexString]}
        onClick={() => {}}
        size="small"
        variant="solid"
      />
    );
  };

  for (const bgColour of bgRecoms) {
    bgSwatches.push(
      <Swatch 
        fill={[bgColour.hexString]}
        onClick={() => {}}
        size="small"
        variant="solid"
      />
    )
  };

  return (
    <Rows spacing="1u">
      <Title size="medium">Recommendations</Title>
      <Text size="small">Foreground</Text>
      {fgSwatches}
      <Text size="small">Background</Text>
      {bgSwatches}
    </Rows>
  )
};