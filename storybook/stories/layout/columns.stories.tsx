import { Box, Title, Text, Rows } from "@canva/app-ui-kit";
import type { Meta } from "@storybook/react";
import React from "react";
import { Column, Columns } from "../../index";

/**
 * The `<Columns/>` component automatically places items horizontally,
 * which you can then align horizontally using the align prop and vertically using the alignY prop.
 * The space between items can be adjusted using the spacing prop.
 *
 * > The `<Column/>` component must be used as children of the `<Columns/>` component.
 */
const meta: Meta<typeof Columns> = {
  title: "@canva/app-ui-kit/Layout/Columns",
  component: Columns,
  tags: ["autodocs"],
  args: { align: "start", alignY: "start", spacing: "1u" },
};

export default meta;

export const ColumnsWithVariableColumn = (args) => {
  return (
    <Columns spacing={args.spacing} align={args.align} alignY={args.alignY}>
      <Column width="1/5">
        <Box
          padding="2u"
          background="neutralLow"
          borderRadius="large"
          height="full"
        >
          <Title size="xsmall">Column</Title>
          <Text>that is taller than others</Text>
        </Box>
      </Column>
      <Column width="1/3">
        <Box
          padding="2u"
          background="neutralLow"
          borderRadius="large"
          height="full"
        >
          <Title size="xsmall">Column</Title>
        </Box>
      </Column>
      <Column width="1/5">
        <Box
          padding="2u"
          background="neutralLow"
          borderRadius="large"
          height="full"
        >
          <Title size="xsmall">Column</Title>
        </Box>
      </Column>
    </Columns>
  );
};

export const ColumnsHorizontalAlignment = (_) => {
  return (
    <Rows spacing="3u">
      <Rows spacing="1u">
        <Title size="small">start</Title>
        <Columns spacing="1u" align="start">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">center</Title>
        <Columns spacing="1u" align="center">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">end</Title>
        <Columns spacing="1u" align="end">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">spaceBetween</Title>
        <Columns spacing="1u" align="spaceBetween">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
    </Rows>
  );
};

export const ColumnsVerticalAlignment = (_) => {
  return (
    <Rows spacing="3u">
      <Rows spacing="1u">
        <Title size="small">start</Title>
        <Columns spacing="1u" align="center" alignY="start">
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
              <Text>that is taller than others</Text>
            </Box>
          </Column>
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">center</Title>
        <Columns spacing="1u" align="center" alignY="center">
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
              <Text>that is taller than others</Text>
            </Box>
          </Column>
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">end</Title>
        <Columns spacing="1u" align="center" alignY="end">
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
              <Text>that is taller than others</Text>
            </Box>
          </Column>
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">stretch</Title>
        <Columns spacing="1u" align="center" alignY="stretch">
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
              <Text>that is taller than others</Text>
            </Box>
          </Column>
          <Column width="1/5">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
    </Rows>
  );
};

export const ColumnsSpacing = (_) => {
  return (
    <Rows spacing="3u">
      <Rows spacing="1u">
        <Title size="small">0</Title>
        <Columns spacing="0">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">0.5u</Title>
        <Columns spacing="0.5u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">1u</Title>
        <Columns spacing="1u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">1.5u</Title>
        <Columns spacing="1.5u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">2u</Title>
        <Columns spacing="2u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">3u</Title>
        <Columns spacing="3u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">4u</Title>
        <Columns spacing="4u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">6u</Title>
        <Columns spacing="6u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">8u</Title>
        <Columns spacing="8u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
      <Rows spacing="1u">
        <Title size="small">12u</Title>
        <Columns spacing="12u">
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
          <Column width="1/3">
            <Box
              padding="2u"
              background="neutralLow"
              borderRadius="large"
              height="full"
            >
              <Title size="xsmall">Column</Title>
            </Box>
          </Column>
        </Columns>
      </Rows>
    </Rows>
  );
};
