import { Column, Columns, Text, ColorSelector, Rows, Title, Button,  RotateIcon } from "@canva/app-ui-kit";
import React from "react";

export const ChooseColours = ({ label, fgColour, bgColour, onClick }) => (
  
  <Rows spacing="2u">
    <Title size="medium">Choose colours</Title>
    <Columns spacing="2u" alignY="center">
      <Column width="containedContent">
        <Text size="medium">Foreground</Text>
      </Column>
      <Column>
        <ColorSelector color={fgColour} onChange={onClick}></ColorSelector>
      </Column>
      <Column width="containedContent">
        <Text size="medium">Background</Text>
      </Column>
      <Column>
        <ColorSelector color={bgColour} onChange={onClick}></ColorSelector>
      </Column>
      <Column>
        <Button variant="tertiary" icon={RotateIcon}></Button>
      </Column>
    </Columns>
  </Rows>
);
