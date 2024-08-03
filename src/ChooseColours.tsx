import { Rows, Columns, Column, ColorSelector, Text, Title, Button, RotateIcon, Swatch } from "@canva/app-ui-kit";
import React from "react";
import { useState } from "react";
import { openColorSelector } from "@canva/asset";

type ChooseColoursProps = {
  fgColour: string;
  bgColour: string;
  onChangeFgColour: (colour: string) => void;
  onChangeBgColour: (colour: string) => void;
  onClick: () => void;
};

export const ChooseColours: React.FC<ChooseColoursProps> = ({ fgColour, bgColour, onChangeFgColour, onChangeBgColour, onClick }) => {
  const [fgFill, setFgFill] = useState(fgColour);
  const [bgFill, setBgFill] = useState(bgColour);
  
  const reverseColors = (): void => {
    const prevFgFill = fgFill;
    setFgFill(bgFill);
    setBgFill(prevFgFill);
  };

  return (
      <Rows spacing="0">
        <Title size="medium">Choose colours</Title>
        <Columns spacing="0.5u" alignY="center">
          <Column width="fluid">
            <Text size="medium">Foreground</Text>
          </Column>
          <Column width="content">
          <Swatch
            fill={[fgFill]}
            onClick={async (event) => {
              const anchor = event.currentTarget.getBoundingClientRect();
              await openColorSelector(anchor, {
                scopes: ["solid"],
                onColorSelect: (event) => {
                  if (event.selection.type === "solid") {
                    setFgFill(event.selection.hexString);
                  }
                },
              });
            }}
          />
          </Column>
        </Columns>
        <Columns spacing="0.5u" align="end">
          <Column>
            <Button variant="tertiary" icon={RotateIcon} onClick={reverseColors}></Button>
          </Column>
        </Columns>
        <Columns spacing="0.5u" alignY="center">
          <Column width="fluid"> 
            <Text size="medium">Background</Text>
          </Column>
          <Column width="content">
            <Swatch
              fill={[bgFill]}
              onClick={async (event) => {
                const anchor = event.currentTarget.getBoundingClientRect();
                await openColorSelector(anchor, {
                  scopes: ["solid"],
                  onColorSelect: (event) => {
                    if (event.selection.type === "solid") {
                      setBgFill(event.selection.hexString);
                    }
                  },
                });
              }}
            />
          </Column>
        </Columns>
      </Rows>
    );
}   