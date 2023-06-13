import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../../index";

/**
 * `<Checkbox/>` is a form control that allows users to make one selection.
 * `<Checkbox/>` can be standalone or within a small group of options.
 *
 * Use `<CheckboxGroup/>` for selections of 2-4 options.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof Checkbox> = {
  title: "@canva/app-ui-kit/Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "Checkbox label" },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const SimpleCheckbox: Story = {};
export const CheckboxWithDefaultValue: Story = {
  args: {
    defaultChecked: true,
  },
};
export const DisabledCheckbox: Story = {
  args: {
    disabled: true,
  },
};
