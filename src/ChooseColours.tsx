import { Rows, Columns, Column, ColorSelector, Text, Title, Button, RotateIcon } from "@canva/app-ui-kit";
import React from "react";

type ChooseColoursProps = {
  fgColour: string;
  bgColour: string;
  onChangeFgColour: (colour: string) => void;
  onChangeBgColour: (colour: string) => void;
  onClick: () => void;
};

export const ChooseColours: React.FC<ChooseColoursProps> = ({ fgColour, bgColour, onChangeFgColour, onChangeBgColour, onClick }) => {
  return (
      <Rows spacing="0">
        <Title size="medium">Choose colours</Title>
        <Columns spacing="0.5u" alignY="center">
          <Column width="fluid">
            <Text size="medium">Foreground</Text>
          </Column>
          <Column width="content">
            <ColorSelector color={fgColour} onChange={onChangeFgColour}></ColorSelector>
          </Column>
        </Columns>
        <Columns spacing="0.5u" align="end">
          <Column>
            <Button variant="tertiary" icon={RotateIcon}></Button>
          </Column>
        </Columns>
        <Columns spacing="0.5u" alignY="center">
          <Column width="fluid"> 
            <Text size="medium">Background</Text>
          </Column>
          <Column width="content">
            <ColorSelector color={bgColour} onChange={onChangeBgColour}></ColorSelector>
          </Column>
        </Columns>
      </Rows>
    );
}   