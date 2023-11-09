import { Box, Rows } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Title } from "../../index";

const meta: Meta<typeof Title> = {
  title: "@canva/app-ui-kit/Typography/Title",
  component: Title,
  tags: ["autodocs"],
  args: {
    children: "Example title",
    size: "medium",
    alignment: "start",
    capitalization: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Title>;

export const SimpleTitle: Story = {};
export const TitleSizes = (args) => {
  return (
    <Rows spacing="1u">
      <Title size="xlarge">{args.children} xlarge</Title>
      <Title size="large">{args.children} large</Title>
      <Title size="medium">{args.children} medium</Title>
      <Title size="small">{args.children} small</Title>
      <Title size="xsmall">{args.children} xsmall</Title>
    </Rows>
  );
};
export const TitleAlignment = (_) => {
  return (
    <Rows spacing="1u">
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Title alignment="start">Start aligned title</Title>
      </Box>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Title alignment="center">Center aligned title</Title>
      </Box>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Title alignment="end">End aligned title</Title>
      </Box>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Title alignment="inherit">Inherit aligned title</Title>
      </Box>
    </Rows>
  );
};
export const TitleCapitalisation = (args) => {
  return (
    <Rows spacing="1u">
      <Title capitalization="default">{args.children} default</Title>
      <Title capitalization="uppercase">{args.children} uppercase</Title>
    </Rows>
  );
};
export const TitleLineClamp = (_) => {
  return (
    <div style={{ width: "200px" }}>
      <Title lineClamp={3}>
        This title should be clamped to 3 lines. Anything more gets truncated.
      </Title>
    </div>
  );
};
export const TitleTone = (args) => {
  return (
    <Rows spacing="1u">
      <Title tone="primary">{args.children} primary </Title>
      <Title tone="secondary">{args.children} secondary </Title>
      <Title tone="tertiary">{args.children} tertiary </Title>
      <Title tone="critical">{args.children} critical </Title>
    </Rows>
  );
};
