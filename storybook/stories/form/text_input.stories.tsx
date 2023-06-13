import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "../../index";

/**
 * `<TextInput/>` allows users to enter and edit a single line of text.
 * The text can also be restricted to special formats such as email, password, or URL.
 *
 * For longer text or multiple lines, use `<MultilineInput/>`. For number values, see `<NumberInput/>`.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 *
 */
const meta: Meta<typeof TextInput> = {
  title: "@canva/app-ui-kit/Form/Text Input",
  component: TextInput,
  tags: ["autodocs"],
  args: {},
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const SimpleTextInput: Story = {};
export const TextInputWithDefaultValue: Story = {
  args: { defaultValue: "Default value" },
};
export const TextInputWithPlaceholder: Story = {
  args: { placeholder: "Placeholder is different to default value" },
};
export const DisabledTextInput: Story = {
  args: { disabled: true, placeholder: "Text input is disabled" },
};
export const TextInputWithError: Story = {
  args: { error: true, placeholder: "Text input has error" },
};
