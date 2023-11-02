import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  CharacterCountDecorator,
  MultilineInput,
  WordCountDecorator,
} from "../../index";

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
  argTypes: {
    footer: {
      // set the type to function to tell storybook not to allow users to provide input for this prop
      type: "function",
    },
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
export const MultilineInputWithWordCountDecorator = (_) => {
  const [value, setValue] = React.useState("hello world");

  return (
    <MultilineInput
      placeholder="Placeholder"
      value={value}
      onChange={setValue}
      footer={<WordCountDecorator max={10} />}
    />
  );
};
export const MultilineInputWithCharacterCountDecorator = (_) => {
  const [value, setValue] = React.useState("hello world");

  return (
    <MultilineInput
      placeholder="Placeholder"
      value={value}
      onChange={setValue}
      footer={<CharacterCountDecorator max={15} />}
    />
  );
};
