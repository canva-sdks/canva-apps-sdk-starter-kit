import React, { useState} from "react";
import { Rows, Text, Swatch, Title, Alert, Box, Button } from "@canva/app-ui-kit";
import { Color } from "@canva/preview/asset";
import { findRecoms } from "./utils";

type RecommendationsProps = {
    fgColour: string;
    bgColour: string;
  };
  
export const RecommendationsComponent: React.FC<RecommendationsProps> = ({ fgColour, bgColour }) => {
  const [alert, setAlert] = useState<{ visible: boolean; message: string }>({ visible: false, message: "Copied to Clipboard!" });

  const fgSwatches: JSX.Element[] = [];
  const bgSwatches: JSX.Element[] = [];

  const fgRecoms: Color[] = findRecoms(fgColour, bgColour);
  const bgRecoms: Color[] = findRecoms(bgColour, fgColour);

  function isArrayEmpty(array: any[]): boolean {
    return array.length !== 0;
  }

  function renderOnCanvas() {

  }

  const handleSwatchClick = (colour: string) => {
    navigator.clipboard.writeText(colour)
      .then(() => {
        setAlert({ visible: true, message: `Color code ${colour} copied to clipboard!` });
        setTimeout(() => setAlert({ visible: false, message: "" }), 7000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };


  for (const fgCol of fgRecoms) {
    fgSwatches.push(
      <Box padding="0.5u">
        <Swatch
          fill={[fgCol.hexString]}
          onClick={() => handleSwatchClick(fgCol.hexString)}
          size="small"
          variant="solid"
        />
      </Box>
    );
  };

  for (const bgCol of bgRecoms) {
    bgSwatches.push(
      <Box padding="0.5u">
        <Swatch 
          fill={[bgCol.hexString]}
          onClick={() => handleSwatchClick(bgCol.hexString)}
          size="small"
          variant="solid"
        />
      </Box>
    )
  };

  return (
    <Rows spacing="1u">
      <Rows spacing="0">
        <Title size="medium">Recommendations</Title>
        <Text size="small">Click on a swatch to copy the colour code</Text>
      </Rows>
      {alert.visible && (
        <Alert tone="positive">
          {alert.message}
        </Alert>
      )}
      {isArrayEmpty(fgRecoms) && 
        <div>
          <Box paddingBottom="1u">
            <Text size="medium">Foreground</Text>
          </Box>
          <Box display="flex" flexDirection="row" padding="0">
            {fgSwatches}
          </Box>
        </div>}
      {isArrayEmpty(bgRecoms) && 
        <div>
          <Box paddingBottom="1u">
            <Text size="medium">Background</Text>
          </Box>
          <Box display="flex" flexDirection="row" padding="0">
            {bgSwatches}
          </Box>
        </div>}
        <Button variant="primary" onClick={() => renderOnCanvas()}>
          Add to canvas
        </Button>
    </Rows>
  )
};