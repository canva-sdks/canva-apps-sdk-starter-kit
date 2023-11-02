import { Text } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Box } from "../../index";

/**
 * The Box component is a styled wrapper for child elements.
 * It adds standardized padding/background/border values.
 *
 * Use Box with padding to add spacing only within a component's boundary.
 * To adjust spacing between elements, use layout components (e.g: Rows, Columns).
 */
const meta: Meta<typeof Box> = {
  title: "@canva/app-ui-kit/Box",
  component: Box,
  tags: ["autodocs"],
  args: { children: "Child of Box" },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const SimpleBox = (args) => {
  return (
    <Box>
      <Text>{args.children}</Text>
    </Box>
  );
};
