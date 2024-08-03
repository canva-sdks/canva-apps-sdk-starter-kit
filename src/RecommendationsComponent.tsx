import React from "react";
import { Rows, Text, Swatch, Title, Columns, Column, Box } from "@canva/app-ui-kit";
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

  function isArrayEmpty(array: any[]): boolean {
    return array.length !== 0;
  }

  for (const fgColour of fgRecoms) {
    fgSwatches.push(
      <Box padding="0.5u">
        <Swatch
          fill={[fgColour.hexString]}
          onClick={() => {}}
          size="small"
          variant="solid"
        />
      </Box>
    );
  };

  for (const bgColour of bgRecoms) {
    bgSwatches.push(
      <Box padding="0.5u">
        <Swatch 
          fill={[bgColour.hexString]}
          onClick={() => {}}
          size="small"
          variant="solid"
        />
      </Box>
    )
  };

  return (
    <Rows spacing="2u">
      <Title size="medium">Recommendations</Title>
      {isArrayEmpty(fgRecoms) && 
        <div>
          <Text size="small">Foreground</Text>
          <Box display="flex" flexDirection="row" padding="0">
            {fgSwatches}
          </Box>
        </div>}
      {isArrayEmpty(bgRecoms) && 
        <div>
          <Text size="small">Background</Text> 
          <Box display="flex" flexDirection="row" padding="0">
            {bgSwatches}
          </Box>
        </div>}
    </Rows>
  )
};