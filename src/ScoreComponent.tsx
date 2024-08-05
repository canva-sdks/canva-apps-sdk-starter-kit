import { Columns, Column, Rows, Text } from "@canva/app-ui-kit";
import React from "react";
import { ShowcaseComponent } from "./ShowcaseComponent";
import { Pill } from "./Pill";

type ScoreComponentProps = {
  fgColour: string;
  bgColour: string;
  contrastScore: number;
};

export const ScoreComponent: React.FC<ScoreComponentProps> = ({ fgColour, bgColour, contrastScore }) => {
  return (
    <div>
      <Rows spacing="2u">
        <Columns spacing="2u" alignY="center">
          <Column width="content">
            <ShowcaseComponent fgColour={fgColour} bgColour={bgColour} />
          </Column>
          <Column>
              <Text size="large" variant="bold">{contrastScore.toFixed(2)}</Text>
          </Column>
        </Columns>

        <Columns spacing="2u" alignY="center">
          <Column width="fluid">
            <Text variant="bold">Large</Text>
          </Column>
          <Column width="content">
            <Text>AA</Text>
          </Column>
          <Column width="content">
            <Pill variant={contrastScore >= 3 ? "Pass" : "Fail"}></Pill>
          </Column>
          <Column width="content">
            <Text>AAA</Text>
          </Column>
          <Column width="content">
            <Pill variant={contrastScore >= 4.5 ? "Pass" : "Fail"}></Pill>
          </Column>
        </Columns>

        <Columns spacing="2u" alignY="center">
          <Column width="fluid">
            <Text variant="bold">Normal</Text>
          </Column>
          <Column width="content">
            <Text>AA</Text>
          </Column>
          <Column width="content">
            <Pill variant={contrastScore >= 4.5 ? "Pass" : "Fail"}></Pill>
          </Column>
          <Column width="content">
            <Text>AAA</Text>
          </Column>
          <Column width="content">
            <Pill variant={contrastScore >= 7 ? "Pass" : "Fail"}></Pill>
          </Column>
        </Columns>
      </Rows>
    </div>
  );
};
