import type { Meta, StoryObj } from "@storybook/react";
import { MultilineInput } from "../../index";

/**
 * `<MultilineInput/>` allows users to enter longer text, potentially spanning multiple lines or paragraphs.
 *
 * For a shorter, single line of text, use `<TextInput/>`. For number values, see `<NumberInput/>`.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof MultilineInput> = {
  title: "@canva/app-ui-kit/Form/MultilineInput",
  component: MultilineInput,
  tags: ["autodocs"],
  args: {
    autoGrow: true,
  },
};

export default meta;
type Story = StoryObj<typeof MultilineInput>;

export const SimpleMultilineInput: Story = {};
export const MultilineInputWithPlaceholder: Story = {
  args: {
    placeholder: "This is an optional placeholder.",
  },
};
export const DisabledMultilineInput: Story = {
  args: {
    disabled: true,
    value:
      "This is a disabled multiline input. This text has been passed in as value.",
  },
};
export const ReadOnlyMultilineInput: Story = {
  args: {
    readOnly: true,
    value:
      "This is a readonly multiline input. This text has been passed in as value.",
  },
};
export const MultilineInputWithMinRows: Story = {
  args: {
    minRows: 3,
    placeholder:
      "This multiline input has a minimum number of 3 rows to render.",
  },
};
export const MultilineInputWithMaxRows: Story = {
  args: {
    minRows: 1,
    placeholder:
      "This multiline input will only show a maximum of 2 row. Longer text will cause the input to scroll.",
  },
};
