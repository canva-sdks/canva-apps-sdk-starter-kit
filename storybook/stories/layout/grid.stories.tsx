import { Box, Title, Rows, Text } from "@canva/app-ui-kit";
import type { Meta } from "@storybook/react";
import React from "react";
import { Grid } from "../../index";

const meta: Meta<typeof Grid> = {
  title: "@canva/app-ui-kit/Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  args: { alignY: "stretch", spacing: "1u", columns: 2 },
};

export default meta;

export const SimpleGrid = (args) => {
  return (
    <Grid
      spacing={args.spacing}
      alignY={args.align}
      columns={args.columns}
      spacingX={args.spacingX}
      spacingY={args.spacingY}
    >
      {Array(args.columns * 3)
        .fill(null)
        .map((_, i) => (
          <Box
            key={i}
            padding="2u"
            background="neutralLow"
            borderRadius="large"
          >
            <Title size="xsmall">Item{i + 1}</Title>
          </Box>
        ))}
    </Grid>
  );
};

export const GridColumns = (args) => {
  return (
    <Rows spacing="3u">
      {[1, 2, 3, 4, 5, 6].map((columns) => (
        <Rows key={columns} spacing="1u">
          <Title size="small">Colums: {columns}</Title>
          <SimpleGrid {...args} columns={columns} />
        </Rows>
      ))}
    </Rows>
  );
};

export const GridSpacing = (args) => {
  return (
    <Rows spacing="3u">
      {["0", "0.5u", "1u", "1.5u", "2u", "3u", "4u", "6u", "8u", "12u"].map(
        (spacing) => (
          <Box
            key={spacing}
            padding="2u"
            background="neutralLow"
            borderRadius="large"
          >
            <Rows spacing="1u">
              <Title size="small">Spacing: {spacing}</Title>
              <SimpleGrid {...args} spacing={spacing} />
            </Rows>
          </Box>
        )
      )}

      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Rows spacing="1u">
          <Title size="small">SpaceX: 3u</Title>
          <SimpleGrid columns={args.columns} spacingX="4u" />
        </Rows>
      </Box>

      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Rows spacing="1u">
          <Title size="small">SpaceY: 3u</Title>
          <SimpleGrid columns={args.columns} spacingY="3u" />
        </Rows>
      </Box>
    </Rows>
  );
};

export const GridVerticalAlignment = (args) => {
  return (
    <Rows spacing="3u">
      {(["stretch", "start", "center", "end"] as const).map((alignY) => (
        <Box
          key={alignY}
          padding="2u"
          background="neutralLow"
          borderRadius="large"
        >
          <Rows spacing="1u">
            <Title size="small">AlignY:{alignY}</Title>
            <Grid columns={3} spacing="3u" alignY={alignY}>
              <Box padding="2u" background="neutralLow" borderRadius="large">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
              </Box>
              <Box padding="2u" background="neutralLow" borderRadius="large">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
                  ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
              </Box>
              <Box padding="2u" background="neutralLow" borderRadius="large">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
                  ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum
                  dolor sit amet consectetur adipisicing elit.
                </Text>
              </Box>
              <Box padding="2u" background="neutralLow" borderRadius="large">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
                  ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum
                  dolor sit amet consectetur adipisicing elit.
                </Text>
              </Box>
              <Box padding="2u" background="neutralLow" borderRadius="large">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
                  ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
              </Box>
              <Box padding="2u" background="neutralLow" borderRadius="large">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
              </Box>
            </Grid>
          </Rows>
        </Box>
      ))}
    </Rows>
  );
};
