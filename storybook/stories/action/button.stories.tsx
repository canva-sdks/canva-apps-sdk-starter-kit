import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Box, Column, Columns, Rows } from "@canva/app-ui-kit";

import { Button } from "../../index";

const meta: Meta<typeof Button> = {
  title: "@canva/app-ui-kit/Action/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    variant: "primary",
    children: "Button",
    disabled: false,
    loading: false,
    stretch: false,
    onClick: () => {
      console.log("button clicked");
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const SimpleButton: Story = {};

/**
 * Primary buttons are for high priority actions.
 * They can be used standalone or alongside secondary and tertiary buttons.
 * Only a single primary button should be used within a particular area.
 */
export const PrimaryButton = (_) => {
  return (
    <Rows spacing={"1u"}>
      <Columns spacing="1u">
        <Column width="content">
          <Button variant="primary">Primary</Button>
        </Column>
        <Column width="content">
          <Button variant="primary" loading>
            Loading
          </Button>
        </Column>
        <Column width="content">
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </Column>
        <Column width="content">
          <Button variant="primary" loading disabled>
            Loading & Disabled
          </Button>
        </Column>
      </Columns>
    </Rows>
  );
};

/**
 * Secondary buttons are for medium priority actions.
 * They can be used standalone or alongside primary and tertiary buttons.
 * Multiple secondary buttons may be used alongside one another.
 */
export const SecondaryButton = (_) => {
  return (
    <Rows spacing={"1u"}>
      <Columns spacing="1u">
        <Column width="content">
          <Button variant="secondary">Secondary</Button>
        </Column>
        <Column width="content">
          <Button variant="secondary" loading>
            Loading
          </Button>
        </Column>
        <Column width="content">
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Column>
        <Column width="content">
          <Button variant="secondary" loading disabled>
            Loading & Disabled
          </Button>
        </Column>
      </Columns>
    </Rows>
  );
};

/**
 * Tertiary buttons are used for low priority actions.
 * They can be used standalone or alongside primary and secondary buttons.
 * Multiple tertiary buttons may be used alongside one another.
 * Tertiary buttons with icons support three different sizes: small, medium, and large.
 */
export const TertiaryButton = (_) => {
  return (
    <Rows spacing={"1u"}>
      <Columns spacing="1u">
        <Column width="content">
          <Button variant="tertiary">Tertiary</Button>
        </Column>
        <Column width="content">
          <Button variant="tertiary" loading>
            Loading
          </Button>
        </Column>
        <Column width="content">
          <Button variant="tertiary" disabled>
            Disabled
          </Button>
        </Column>
        <Column width="content">
          <Button variant="tertiary" loading disabled>
            Loading & Disabled
          </Button>
        </Column>
      </Columns>
    </Rows>
  );
};

/**
 * The button width can be stretched to fill the container using the `stretch` prop.
 *
 * > **_Note:_** Buttons which are children of the `<Rows/>` component also stretch the full width of the container.
 */
export const ButtonWidths = (_) => {
  return (
    <>
      <Button variant="primary">Regular button</Button>
      <Box paddingBottom="1u"></Box>
      <Button variant="primary" stretch>
        Stretched button
      </Button>
      <Box paddingBottom="1u"></Box>
      <Rows spacing={"0"}>
        <Button variant="primary">Button inside Rows</Button>
      </Rows>
    </>
  );
};
