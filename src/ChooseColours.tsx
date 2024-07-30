import { Column, Columns, Text, ColorSelector, Rows, Title, Button,  RotateIcon } from "@canva/app-ui-kit";
import React from "react";

export const ChooseColours = ({ fgColour, bgColour, onClick }) => (
  
  <Rows spacing="0">
    <Title size="medium">Choose colours</Title>
    <Columns spacing="0.5u" alignY="center">
      <Column width="fluid">
        <Text size="medium">Foreground</Text>
      </Column>
      <Column width="content">
        <ColorSelector color={fgColour} onChange={onClick}></ColorSelector>
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
        <ColorSelector color={bgColour} onChange={onClick}></ColorSelector>
      </Column>
    </Columns>



  </Rows>
);
