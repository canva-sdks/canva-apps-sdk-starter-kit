import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "../../index";

/**
 *
 * `<RadioGroup/>` is a form control that allows users to choose one of a small group of options.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof RadioGroup> = {
  title: "@canva/app-ui-kit/Form/Radio Group",
  component: RadioGroup,
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
type Story = StoryObj<typeof RadioGroup>;

export const SimpleRadioGroup: Story = {};
export const RadioGroupWithDefaultValue: Story = {
  args: {
    defaultValue: "strawberry",
  },
};
export const DisabledRadioGroup: Story = {
  args: {
    disabled: true,
  },
};
export const RadioGroupWithSingleOptionDisabled: Story = {
  args: {
    options: [
      { value: "blueberry", label: "Blueberry" },
      { value: "apple", label: "Apple", disabled: true },
      { value: "strawberry", label: "Strawberry" },
    ],
  },
};
