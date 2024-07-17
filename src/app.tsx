import { Box, Button, ColorSelector, Column, Columns, HelpCircleIcon, Placeholder, PlusIcon, RotateIcon, Rows, Text, Title } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import * as React from "react";
import styles from "styles/components.css";
import { useState } from "react";

export const App = () => {
  // constant bool for showing checker
  const [showComponents, setShowComponents] = useState(false);

  // default random onClick function - adds text "Hello world!" to the canvas
  const onClick = () => {
    addNativeElement({
      type: "TEXT",
      children: ["Hello world!"],
    });
  };

  // function for showing score
  const toggleScore = () => {
    setShowComponents(true);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1.5u">
        <Title size="medium">
            Choose colours
        </Title>

        <Columns spacing="1.5u" alignY="center">
          <Column>
              <Text size="xsmall">
                Foreground
              </Text>
          </Column>
          <Column>
            <ColorSelector color="#FFFFFF" onChange={onClick}>
            </ColorSelector>
          </Column>
          <Column>
            <Text size="xsmall" alignment="inherit">
              Background
            </Text>
          </Column>
          <Column>
            <ColorSelector color="#000000" onChange={onClick}>
            </ColorSelector>
          </Column>
          <Column>
            <Button variant="secondary" icon={PlusIcon}>
            </Button>
          </Column>
          <Column>
            <Button variant="secondary" icon={RotateIcon}>
            </Button>
          </Column>
        </Columns>
        <Button variant="primary" stretch={true} onClick={toggleScore}>
          Calculate contrast score
        </Button>
      </Rows>

      {showComponents && (
        <div className={styles.scrollContainer}>
          <Rows spacing="2u">
            <Columns spacing="1.5u" alignY="center">
              <Column width="1/2">
                <Placeholder shape="square"></Placeholder>
              </Column>
              <Column>
                <Box>
                  <Text variant="bold">
                    000.00
                  </Text>
                </Box>
              </Column>
              <Column>
                <HelpCircleIcon></HelpCircleIcon>
              </Column>
            </Columns>

            <Columns spacing="1.5u">
              <Column>
                <Text>
                  Large
                </Text>
              </Column>
              <Column>
                <Columns spacing="0">
                  <Column>
                    <Text>
                      AA
                    </Text>
                  </Column>
                  <Column>
                    <Placeholder shape="circle"></Placeholder>
                  </Column>
                </Columns>
              </Column>
              <Column>
                <Columns spacing="0">
                  <Column>
                    <Text>
                      AAA
                    </Text>
                  </Column>
                  <Column>
                    <Placeholder shape="circle"></Placeholder>
                  </Column>
                </Columns>
              </Column>
            </Columns>

            <Columns spacing="1.5u">
              <Column>
                <Text>
                  Normal
                </Text>
              </Column>
              <Column>
                <Columns spacing="0">
                  <Column>
                    <Text>
                      AA
                    </Text>
                  </Column>
                  <Column>
                    <Placeholder shape="circle"></Placeholder>
                  </Column>
                </Columns>
              </Column>
              <Column>
                <Columns spacing="0">
                  <Column>
                    <Text>
                      AAA
                    </Text>
                  </Column>
                  <Column>
                    <Placeholder shape="circle"></Placeholder>
                  </Column>
                </Columns>
              </Column>
            </Columns>

          </Rows>
        </div>
        )}

    </div>
  );
};
