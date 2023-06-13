import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxGroup } from "../../index";

/**
 * `<CheckboxGroup/>` is a form control that allows users to make selections of 2-4 options.
 *
 * Use the `<Checkbox/>` component when using a standalone selection.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof CheckboxGroup> = {
  title: "@canva/app-ui-kit/Form/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  args: {
    options: [
      { value: "blueberry", label: "Blueberry" },
      { value: "apple", label: "Apple" },
      { value: "strawberry", label: "Strawberry" },
    ],
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const SimpleCheckboxGroup: Story = {};
export const CheckboxGroupWithDefaultValue: Story = {
  args: { defaultValue: ["apple", "strawberry"] },
};
export const DisabledCheckboxGroup: Story = {
  args: {
    disabled: true,
  },
};
export const CheckboxGroupWithSingleOptionDisabled: Story = {
  args: {
    options: [
      { value: "blueberry", label: "Blueberry" },
      { value: "apple", label: "Apple", disabled: true },
      { value: "strawberry", label: "Strawberry" },
    ],
  },
};
