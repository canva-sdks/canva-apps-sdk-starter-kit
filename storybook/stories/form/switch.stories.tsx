import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../../index";

/**
 * `<Switch/>` is a form control that allows users to choose one option that is saved and applied immediately, such as a simple on-off toggle.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof Switch> = {
  title: "@canva/app-ui-kit/Form/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { label: "Switch label" },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const SimpleSwitch: Story = {};
export const SwitchWithDefaultValue: Story = {
  args: {
    defaultValue: true,
  },
};
export const DisabledSwitch: Story = {
  args: {
    disabled: true,
  },
};
export const SwitchWithDescription: Story = {
  args: {
    description: "Switch description",
  },
};
