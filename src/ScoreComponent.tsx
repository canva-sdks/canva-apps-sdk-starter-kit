import { Box, Columns, Column, Rows, Text, Placeholder, HelpCircleIcon, Button } from "@canva/app-ui-kit";
import React from "react";
import styles from "styles/components.css";
import { ShowcaseComponent } from "./ShowcaseComponent";
import { Pill } from "./Pill";

export const ScoreComponent = () => (
  <div>
    <Rows spacing="2u">
      <Columns spacing="2u" alignY="center">
        <Column width="content">
          {/* <Placeholder shape="square"></Placeholder> */}
          <ShowcaseComponent></ShowcaseComponent>
        </Column>
        <Column>
            <Text variant="bold">000.00</Text>
        </Column>
        <Column>
          <HelpCircleIcon></HelpCircleIcon>
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
          <Pill variant="Pass">Pass</Pill>
        </Column>
        <Column width="content">
          <Text>AAA</Text>
        </Column>
        <Column width="content">
          <Pill variant="Fail">Pass</Pill>
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
              <Pill variant="Fail">Pass</Pill>
            </Column>
            <Column width="content">
              <Text>AAA</Text>
            </Column>
            <Column width="content">
              <Pill variant="Fail">Pass</Pill>
            </Column>
      </Columns>
    </Rows>
  </div>
);
