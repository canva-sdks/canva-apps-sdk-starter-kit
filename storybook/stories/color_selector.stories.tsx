import type { Meta, StoryObj } from "@storybook/react";
import { ColorSelector } from "../index";

const meta: Meta<typeof ColorSelector> = {
  title: "@canva/app-ui-kit/ColorSelector",
  component: ColorSelector,
  tags: ["autodocs"],
  args: {
    color: "#143F6B",
    onChange: () => {
      console.log("color selector clicked");
    },
  },
};

/**
 * The <ColorSelector/> component renders a clickable swatch.
 * Once clicked, a flyout is rendered with a color picker, and the swatch color is updated according to the users' selection
 */
export default meta;
type Story = StoryObj<typeof ColorSelector>;

export const SimpleColorSelector: Story = {};
