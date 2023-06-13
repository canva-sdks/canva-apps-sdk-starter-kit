import { Rows, Title } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LoadingIndicator } from "../../index";

/**
 * `<LoadingIndicator/>` notifies the user that content is being loaded or
 * the action they requested is being processed. This is typically used
 * for shorter loading times.
 *
 * For accessibility, the context of showing the `<LoadingIndicator/>`
 * should be communicated by the surrounding text or invisible text
 * displayed using {@link ScreenReaderContent}.
 */
const meta: Meta<typeof LoadingIndicator> = {
  title: "@canva/app-ui-kit/Progress/Loading Indicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  args: { size: "medium" },
};

export default meta;
type Story = StoryObj<typeof LoadingIndicator>;

export const SimpleLoadingIndicator: Story = {};
export const LoadingIndicatorSize = (_) => (
  <Rows spacing="1u">
    <Title size="xsmall">Small</Title>
    <LoadingIndicator size="small" />
    <Title size="xsmall">Medium</Title>
    <LoadingIndicator size="medium" />
    <Title size="xsmall">Large</Title>
    <LoadingIndicator size="large" />
  </Rows>
);
