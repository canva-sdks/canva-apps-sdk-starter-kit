import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../../index";

/**
 * `<Slider/>` allows users to enter or select a number from a pre-defined range using a slider.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof Slider> = {
  title: "@canva/app-ui-kit/Form/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const SimpleSliderInput: Story = {};
export const FloatingPointValueSlider: Story = {
  args: {
    step: "any",
  },
};
export const DisabledSliderInput: Story = {
  args: {
    disabled: true,
  },
};
export const SliderWithOriginAt50: Story = {
  args: {
    origin: 50,
  },
};
