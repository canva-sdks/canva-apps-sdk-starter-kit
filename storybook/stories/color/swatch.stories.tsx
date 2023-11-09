import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Column, Columns, Rows, Title } from "@canva/app-ui-kit";
import { Swatch } from "../../index";

/**
 * The `<Swatch/>` component provides a visual representation of a color.
 * It is often used as a trigger to open a Color Picker dropdown and represent the color selected by the user.
 */
const meta: Meta<typeof Swatch> = {
  title: "@canva/app-ui-kit/Color/Swatch",
  component: Swatch,
  tags: ["autodocs"],
  args: {
    fill: ["#143F6B"],
    variant: "solid",
    active: false,
    size: "small",
    disabled: false,
    onClick: () => {
      console.log("swatch clicked");
    },
  },
};

export default meta;
type Story = StoryObj<typeof Swatch>;

export const SimpleSwatch: Story = {};

export const ClickableSwatch = (_) => {
  return (
    <Columns spacing="1u">
      <Column>
        <Rows spacing="1u">
          <Title size="xsmall">Clickable</Title>
          <Swatch fill={["#F55353"]} onClick={action("swatch clicked")} />
        </Rows>
      </Column>
      <Column>
        <Rows spacing="1u">
          <Title size="xsmall">Active</Title>
          <Swatch
            fill={["#F55353"]}
            active={true}
            onClick={action("swatch clicked")}
          />
        </Rows>
      </Column>
      <Column>
        <Rows spacing="1u">
          <Title size="xsmall">Disabled</Title>
          <Swatch
            fill={["#F55353"]}
            disabled={true}
            onClick={action("swatch clicked")}
          />
        </Rows>
      </Column>
    </Columns>
  );
};

const SwatchFill = ({ variant }) => {
  return (
    <Rows spacing="1u">
      <Columns spacing="1u">
        <Column>
          <Rows spacing="1u">
            <Title size="xsmall">One color</Title>
            <Swatch fill={["#143F6B"]} variant={variant} />
          </Rows>
        </Column>
        <Column>
          <Rows spacing="1u">
            <Title size="xsmall">Two colors</Title>
            <Swatch fill={["#143F6B", "#F55353"]} variant={variant} />
          </Rows>
        </Column>
        <Column>
          <Rows spacing="1u">
            <Title size="xsmall">Three colors</Title>
            <Swatch
              fill={["#143F6B", "#F55353", "#FEB139"]}
              variant={variant}
            />
          </Rows>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column>
          <Rows spacing="1u">
            <Title size="xsmall">Rgb color with transparency</Title>
            <Swatch
              fill={["rgba(255,62,233,0.099999)"]}
              onClick={action("swatch clicked")}
              variant={variant}
            />
          </Rows>
        </Column>
        <Column>
          <Rows spacing="1u">
            <Title size="xsmall">One color + transparency</Title>
            <Swatch fill={["#143F6B", undefined]} variant={variant} />
          </Rows>
        </Column>
        <Column>
          <Rows spacing="1u">
            <Title size="xsmall">All transparent</Title>
            <Swatch fill={[undefined]} variant={variant} />
          </Rows>
        </Column>
      </Columns>
    </Rows>
  );
};

export const SwatchFillWithSolidVariant = (_) =>
  SwatchFill({ variant: "solid" });

export const SwatchFillWithOutlineVariant = (_) =>
  SwatchFill({ variant: "outline" });

export const SwatchSize = (_) => (
  <Columns spacing="1u">
    <Column width="1/5">
      <Rows spacing="1u">
        <Title size="xsmall">xsmall</Title>
        <Swatch fill={["#143F6B"]} size="xsmall" />
      </Rows>
    </Column>
    <Column width="1/5">
      <Rows spacing="1u">
        <Title size="xsmall">small</Title>
        <Swatch fill={["#143F6B"]} size="small" />
      </Rows>
    </Column>
  </Columns>
);
