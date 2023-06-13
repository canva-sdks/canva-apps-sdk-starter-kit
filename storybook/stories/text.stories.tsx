import { Box, Rows } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "../index";

const meta: Meta<typeof Text> = {
  title: "@canva/app-ui-kit/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children: "Example text",
    size: "medium",
    variant: "regular",
    alignment: "start",
    capitalization: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const SimpleText: Story = {};
export const TextSizes = (args) => {
  return (
    <Rows spacing="1u">
      <Text size="xlarge">{args.children} xlarge</Text>
      <Text size="large">{args.children} large</Text>
      <Text size="medium">{args.children} medium</Text>
      <Text size="small">{args.children} small</Text>
      <Text size="xsmall">{args.children} xsmall</Text>
    </Rows>
  );
};
export const TextVariant = (args) => {
  return (
    <Rows spacing="1u">
      <Text variant="regular">{args.children} regular</Text>
      <Text variant="bold">{args.children} bold</Text>
    </Rows>
  );
};
export const TextAlignment = (_) => {
  return (
    <Rows spacing="1u">
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Text alignment="start">Start aligned text</Text>
      </Box>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Text alignment="center">Center aligned text</Text>
      </Box>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Text alignment="end">End aligned text</Text>
      </Box>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Text alignment="inherit">Inherit aligned text</Text>
      </Box>
    </Rows>
  );
};
export const TextCapitalisation = (args) => {
  return (
    <Rows spacing="1u">
      <Text capitalization="default">{args.children} default</Text>
      <Text capitalization="uppercase">{args.children} uppercase </Text>
    </Rows>
  );
};
export const TextLineClamp = (_) => {
  return (
    <div style={{ width: "200px" }}>
      <Text lineClamp={3}>
        This Text should be clamped to 3 lines. Anything more gets truncated.
      </Text>
    </div>
  );
};
export const TextTone = (args) => {
  return (
    <Rows spacing="1u">
      <Text tone="primary">{args.children} primary </Text>
      <Text tone="secondary">{args.children} secondary </Text>
      <Text tone="tertiary">{args.children} tertiary </Text>
      <Text tone="critical">{args.children} critical </Text>
    </Rows>
  );
};
