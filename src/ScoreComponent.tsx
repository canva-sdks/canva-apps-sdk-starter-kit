import { Box, Columns, Column, Rows, Text, Placeholder, HelpCircleIcon, Button } from "@canva/app-ui-kit";
import React from "react";
import styles from "styles/components.css";

export const ScoreComponent = () => (
  <div className={styles.scrollContainer}>
    <Rows spacing="2u">
      <Columns spacing="0.5u" alignY="center">
        <Column width="1/2">
          <Placeholder shape="square"></Placeholder>
        </Column>
        <Column>
          <Box>
            <Text variant="bold">000.00</Text>
          </Box>
        </Column>
        <Column>
          <HelpCircleIcon></HelpCircleIcon>
        </Column>
      </Columns>

      <Columns spacing="0">
        <Column>
          <Text>Large</Text>
        </Column>
        <Column>
          <Columns spacing="0">
            <Column>
              <Text>AA</Text>
            </Column>
            <Column>
              <Button variant="tertiary" stretch={false} iconPosition="start">
                Pass
              </Button>
            </Column>
          </Columns>
        </Column>
        <Column>
          <Columns spacing="0">
            <Column>
              <Text>AAA</Text>
            </Column>
            <Column>
              <Placeholder shape="circle"></Placeholder>
            </Column>
          </Columns>
        </Column>
      </Columns>

      <Columns spacing="0">
        <Column>
          <Text>Normal</Text>
        </Column>
        <Column>
          <Columns spacing="0">
            <Column>
              <Text>AA</Text>
            </Column>
            <Column>
              <Placeholder shape="circle"></Placeholder>
            </Column>
          </Columns>
        </Column>
        <Column>
          <Columns spacing="0">
            <Column>
              <Text>AAA</Text>
            </Column>
            <Column>
              <Placeholder shape="circle"></Placeholder>
            </Column>
          </Columns>
        </Column>
      </Columns>
    </Rows>
  </div>
);
