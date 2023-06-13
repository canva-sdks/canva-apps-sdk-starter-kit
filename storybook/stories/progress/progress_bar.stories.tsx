import { Rows, Title } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ProgressBar } from "../../index";

/**
 * `<ProgressBar/>` takes a value between 1-100 and grows, filing the bar, to visually represent the progress to complete a task or operation.
 */
const meta: Meta<typeof ProgressBar> = {
  title: "@canva/app-ui-kit/Progress/Progress Bar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  args: { value: 50, size: "medium", tone: "info" },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const SimpleProgressBar: Story = {};
export const ProgressBarSize = (_) => (
  <Rows spacing="1u">
    <Title size="xsmall">Medium size</Title>
    <ProgressBar value={50} size="medium" />
    <Title size="xsmall">Small size</Title>
    <ProgressBar value={50} size="small" />
  </Rows>
);
export const ProgressBarTone = (_) => (
  <Rows spacing={"1u"}>
    <Title size="xsmall">Info</Title>
    <ProgressBar value={50} tone="info" />
    <Title size="xsmall">Critical</Title>
    <ProgressBar value={50} tone="critical" />
  </Rows>
);
export const ProgressBarWithBubblesDisabled: Story = {
  args: { disableBubbles: true },
};
