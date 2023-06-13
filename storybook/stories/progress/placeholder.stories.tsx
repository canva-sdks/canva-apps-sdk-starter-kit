import { Column, Columns } from "@canva/app-ui-kit";
import type { Meta } from "@storybook/react";
import React from "react";
import { Placeholder } from "../../index";

/**
 * `<Placeholder/>` is used to visualize content while waiting for it to load.
 *
 * A circle & square placeholder shape takes the width of its parent container.
 * A rectangle & sharpRectangle shape takes the width & height of its parent container.
 *
 * For placeholders used for Text or Titles, use `<TextPlaceholder/>` or `<TitlePlaceholder/>`.
 */
const meta: Meta<typeof Placeholder> = {
  title: "@canva/app-ui-kit/Progress/Placeholder/Placeholder",
  component: Placeholder,
  tags: ["autodocs"],
  args: { shape: "circle" },
};

export default meta;

export const SimplePlaceholder = (args) => (
  <div style={{ width: "100px", height: "120px" }}>
    <Placeholder shape={args.shape} />
  </div>
);
export const PlaceholderShapes = (_) => (
  <Columns spacing="1u">
    <Column>
      <Placeholder shape="circle" />
    </Column>
    <Column>
      <Placeholder shape="square" />
    </Column>
    <Column>
      <div style={{ height: "150px" }}>
        <Placeholder shape="rectangle" />
      </div>
    </Column>
    <Column>
      <div style={{ height: "150px" }}>
        <Placeholder shape="sharpRectangle" />
      </div>
    </Column>
  </Columns>
);
