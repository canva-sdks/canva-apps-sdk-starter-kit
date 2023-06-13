import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "../../index";

/**
 * `<SegmentedControl/>` is a form control that allows users to select one option from a group of 2-4 options.
 *
 * Use `<SegmentedControl/>` when the selection needs to be clearly defined from the surrounding elements.
 * `<SegmentedControl/>` fills the width of its parent container and each option is the same width.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof SegmentedControl> = {
  title: "@canva/app-ui-kit/Form/Segmented Control",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: {
    options: [
      { value: "blueberry", label: "Blueberry" },
      { value: "apple", label: "Apple" },
      { value: "strawberry", label: "Strawberry" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const SimpleSegmentedControl: Story = {};
export const SegmentedControlWithDefaultValue: Story = {
  args: {
    defaultValue: "strawberry",
  },
};
export const DisabledSegmentedControl: Story = {
  args: {
    disabled: true,
  },
};
export const SegmentedControlWithSingleOptionDisabled: Story = {
  args: {
    options: [
      { value: "blueberry", label: "Blueberry" },
      { value: "apple", label: "Apple", disabled: true },
      { value: "strawberry", label: "Strawberry" },
    ],
  },
};
