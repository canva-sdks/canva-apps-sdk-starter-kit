import { Box, Columns, Column, Rows, Text, Placeholder, HelpCircleIcon, Button } from "@canva/app-ui-kit";
import React from "react";
import { ShowcaseComponent } from "./ShowcaseComponent";
import { Pill } from "./Pill";
import { calculateContrast } from "./utils";

type ScoreComponentProps = {
  fgColour: string;
  bgColour: string;
};

export const ScoreComponent: React.FC<ScoreComponentProps> = ({ fgColour, bgColour }) => {
  const contrastScore = calculateContrast(fgColour, bgColour);

  return (
    <div>
      <Rows spacing="2u">
        <Columns spacing="2u" alignY="center">
          <Column width="content">
            <ShowcaseComponent fgColour={fgColour} bgColour={bgColour} />
          </Column>
          <Column>
            <Text variant="bold">{contrastScore.toFixed(2)}</Text>
          </Column>
          <Column>
            <HelpCircleIcon />
          </Column>
        </Columns>

        <Columns spacing="2u" alignY="center">
          <Column width="1/4">
            <Text variant="bold">Large</Text>
          </Column>
          <Column width="content">
            <Text>AA</Text>
          </Column>
          <Column width="content">
            <Pill variant={contrastScore >= 3 ? "Pass" : "Fail"}>{contrastScore >= 3 ? "Pass" : "Fail"}</Pill>
          </Column>
          <Column width="content">
            <Text>AAA</Text>
          </Column>
          <Column width="content">
            <Pill variant={contrastScore >= 4.5 ? "Pass" : "Fail"}>{contrastScore >= 3 ? "Pass" : "Fail"}</Pill>
          </Column>
        </Columns>

        <Columns spacing="2u" alignY="center">
          <Column width="1/4">
            <Text variant="bold">Normal</Text>
          </Column>
          <Column width="content">
            <Text>AA</Text>
          </Column>
          <Column width="content">
            <Pill variant={contrastScore >= 4.5 ? "Pass" : "Fail"}>{contrastScore >= 4.5 ? "Pass" : "Fail"}</Pill>
          </Column>
          <Column width="content">
            <Text>AAA</Text>
          </Column>
          <Column width="content">
            <Pill variant={contrastScore >= 7 ? "Pass" : "Fail"}>{contrastScore >= 7 ? "Pass" : "Fail"}</Pill>
          </Column>
        </Columns>
      </Rows>
    </div>
  );
};
