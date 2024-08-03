import React from "react";
import { Rows, Text, Swatch } from "@canva/app-ui-kit";
import { Color } from "@canva/preview/asset";

type RecommendationsProps = {
    fgRecoms: Color[];
    bgRecoms: Color[];
  };
  
export const RecommendationsComponent: React.FC<RecommendationsProps> = ({ fgRecoms, bgRecoms }) => {
  const fgSwatches: JSX.Element[] = [];
  const bgSwatches: JSX.Element[] = [];

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
      <Text size="medium" variant="bold">Recommendations</Text>
      <Text size="small">Foreground</Text>
      {fgSwatches}
      <Text size="small">Background</Text>
      {bgSwatches}
    </Rows>
  )
};