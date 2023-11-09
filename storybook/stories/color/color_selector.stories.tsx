import type { Meta } from "@storybook/react";
import { ColorSelector } from "../../index";
import React from "react";

const meta: Meta<typeof ColorSelector> = {
  title: "@canva/app-ui-kit/Color/ColorSelector",
  component: ColorSelector,
  tags: ["autodocs"],
  args: {
    color: "#143F6B",
    onChange: () => {
      console.log("color selector clicked");
    },
  },
};

export default meta;

/**
 * The `<ColorSelector/>` component renders a clickable swatch.
 * Once clicked, a flyout is rendered with a color picker, and the swatch color is updated according to the users' selection
 */
export const SimpleColorSelector = (_: any) => {
  const [color, setColor] = React.useState("#143F6B");

  return <ColorSelector color={color} onChange={(color) => setColor(color)} />;
};
