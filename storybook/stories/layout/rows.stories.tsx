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
      {(["start", "center", "end", "stretch"] as const).map((alignment) => {
        return (
          <Rows spacing="1u">
            <Title size="small">Align: {alignment}</Title>
            <Rows spacing="1u" align={alignment}>
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
        );
      })}
    </Rows>
  );
};

export const RowsSpacing = (_) => {
  return (
    <Rows spacing="3u">
      {(
        [
          "0",
          "0.5u",
          "1u",
          "1.5u",
          "2u",
          "3u",
          "4u",
          "6u",
          "8u",
          "12u",
        ] as const
      ).map((row) => (
        <Box
          key={row}
          padding="2u"
          background="neutralLow"
          borderRadius="large"
        >
          <Rows spacing={"1u"}>
            <Title size="small">Spacing: {row}</Title>
            <Rows spacing={row}>
              <Box
                key={row}
                padding="2u"
                background="neutralLow"
                borderRadius="large"
              ></Box>
              <Box
                key={row}
                padding="2u"
                background="neutralLow"
                borderRadius="large"
              ></Box>
              <Box
                key={row}
                padding="2u"
                background="neutralLow"
                borderRadius="large"
              ></Box>
            </Rows>
          </Rows>
        </Box>
      ))}
    </Rows>
  );
};
