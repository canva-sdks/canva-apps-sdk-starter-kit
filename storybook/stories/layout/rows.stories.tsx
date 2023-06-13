import { Box, Title } from "@canva/app-ui-kit";
import type { Meta } from "@storybook/react";
import React from "react";
import { Rows } from "../../index";

/**
 * The `<Rows/>` component places items vertically.
 * The space between items can be adjusted using the spacing prop. Items can be aligned horizontally using the align prop.
 */
const meta: Meta<typeof Rows> = {
  title: "@canva/app-ui-kit/Layout/Rows",
  component: Rows,
  tags: ["autodocs"],
  args: { align: "stretch", spacing: "1u" },
};

export default meta;

export const SimpleRows = (args) => {
  return (
    <Rows spacing={args.spacing} align={args.align}>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Title size="xsmall">Row</Title>
      </Box>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Title size="xsmall">Row</Title>
      </Box>
      <Box padding="2u" background="neutralLow" borderRadius="large">
        <Title size="xsmall">Row</Title>
      </Box>
    </Rows>
  );
};

export const RowsAlignment = (_) => {
  return (
    <Rows spacing="3u">
      <Rows spacing="1u">
        <Title size="small">start</Title>
        <Rows spacing="1u" align="start">
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Medium Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Longer than the rest Row</Title>
          </Box>
        </Rows>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">center</Title>
        <Rows spacing="1u" align="center">
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Medium Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Longer than the rest Row</Title>
          </Box>
        </Rows>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">end</Title>
        <Rows spacing="1u" align="end">
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Medium Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Longer than the rest Row</Title>
          </Box>
        </Rows>
        <Rows spacing="1u">
          <Title size="small">stretch</Title>
          <Rows spacing="1u" align="stretch">
            <Box padding="2u" background="neutralLow" borderRadius="large">
              <Title size="xsmall">Row</Title>
            </Box>
            <Box padding="2u" background="neutralLow" borderRadius="large">
              <Title size="xsmall">Medium Row</Title>
            </Box>
            <Box padding="2u" background="neutralLow" borderRadius="large">
              <Title size="xsmall">Longer than the rest Row</Title>
            </Box>
          </Rows>
        </Rows>
      </Rows>
    </Rows>
  );
};

export const RowsSpacing = (_) => {
  return (
    <Rows spacing="3u">
      <Rows spacing="1u">
        <Title size="small">start</Title>
        <Rows spacing="1u" align="start">
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Medium Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Longer than the rest Row</Title>
          </Box>
        </Rows>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">center</Title>
        <Rows spacing="1u" align="center">
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Medium Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Longer than the rest Row</Title>
          </Box>
        </Rows>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">end</Title>
        <Rows spacing="1u" align="end">
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Medium Row</Title>
          </Box>
          <Box padding="2u" background="neutralLow" borderRadius="large">
            <Title size="xsmall">Longer than the rest Row</Title>
          </Box>
        </Rows>
        <Rows spacing="1u">
          <Title size="small">stretch</Title>
          <Rows spacing="1u" align="stretch">
            <Box padding="2u" background="neutralLow" borderRadius="large">
              <Title size="xsmall">Row</Title>
            </Box>
            <Box padding="2u" background="neutralLow" borderRadius="large">
              <Title size="xsmall">Medium Row</Title>
            </Box>
            <Box padding="2u" background="neutralLow" borderRadius="large">
              <Title size="xsmall">Longer than the rest Row</Title>
            </Box>
          </Rows>
        </Rows>
      </Rows>
    </Rows>
  );
};
