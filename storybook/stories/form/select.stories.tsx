import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../../index";

/**
 * `<Select/>` is a form control that allows users to choose from multiple options in a compact format.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof Select> = {
  title: "@canva/app-ui-kit/Form/Select",
  component: Select,
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
type Story = StoryObj<typeof Select>;

export const SimpleSelect: Story = {};
export const SelectWithPlaceholder: Story = {
  args: { placeholder: "Custom select placeholder" },
};
export const StretchedPlaceholder: Story = {
  args: { stretch: true },
};
export const DisabledSelect: Story = {
  args: {
    disabled: true,
  },
};
export const SelectWithError: Story = {
  args: {
    error: true,
  },
};
