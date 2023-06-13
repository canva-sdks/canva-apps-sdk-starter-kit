import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NumberInput } from "../../index";

/**
 * `<NumberInput/>` allows users to enter a specific number.
 * Users can also adjust the number by using up and down keys.
 * Spinner buttons can also be rendered using the `hasSpinButtons` prop.
 *
 * For numeric values that are an identification number, such as a postcode or credit card, use `<TextInput/>`.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof NumberInput> = {
  title: "@canva/app-ui-kit/Form/Number Input",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    min: {
      table: {
        category: "range",
      },
    },
    max: {
      table: {
        category: "range",
      },
    },
    hasSpinButtons: {
      table: {
        category: "spin buttons",
      },
    },
    step: {
      table: {
        category: "spin buttons",
      },
    },
    decrementAriaLabel: {
      table: {
        category: "spin buttons",
      },
    },
    incrementAriaLabel: {
      table: {
        category: "spin buttons",
      },
    },
  },
  args: { defaultValue: 5 },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const SimpleNumberInput: Story = {};
export const NumberInputWithDefaultValue: Story = {
  args: { defaultValue: 5 },
};
export const NumberInputWithSpinners: Story = {
  args: {
    defaultValue: 0,
    hasSpinButtons: true,
    step: 5,
    decrementAriaLabel: "Decrement example number",
    incrementAriaLabel: "Increment example number",
  },
};
export const DisabledNumberInput: Story = {
  args: { disabled: true },
};
export const NumberInputWithError: Story = {
  args: { error: true },
};

export const NumberInputWithState = (_) => {
  const [state, setState] = React.useState<number | string>(0);

  return (
    <NumberInput
      value={state}
      min={-100}
      max={100}
      onChange={(valueAsNumber, valueAsString) => {
        if (valueAsNumber) {
          setState(Number(valueAsNumber));
        } else {
          setState(valueAsString);
        }
      }}
    />
  );
};
