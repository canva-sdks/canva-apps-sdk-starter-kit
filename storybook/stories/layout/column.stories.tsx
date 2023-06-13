import { Box, Title, Rows } from "@canva/app-ui-kit";
import type { Meta } from "@storybook/react";
import React from "react";
import { Column, Columns } from "../../index";

/**
 * The `<Column/>` component is a component that must be used as children of the `<Columns/>` component.
 * This allows `<Columns/>` to automatically align each columns horizontally.
 * The width of each column can be defined using the width prop in `<Column/>`.
 */
const meta: Meta<typeof Column> = {
  title: "@canva/app-ui-kit/Layout/Column",
  component: Column,
  tags: ["autodocs"],
  args: {},
};

export default meta;

export const ColumnsWithVariableWidths = (args) => {
  return (
    <Columns spacing="1u">
      <Column width={args.width}>
        <Box
          padding="2u"
          background="neutralLow"
          borderRadius="large"
          height="full"
        >
          <Title size="xsmall">Column</Title>
        </Box>
      </Column>
      <Column width={args.width}>
        <Box
          padding="2u"
          background="neutralLow"
          borderRadius="large"
          height="full"
        >
          <Title size="xsmall">Column</Title>
        </Box>
      </Column>
      <Column width={args.width}>
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

export const ColumnWidths = (_) => {
  return (
    <Rows spacing="1u">
      <Columns spacing="1u">
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="content">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">content</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="containedContent">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">containedContent</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="containedContent">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">containedContent</Title>
          </Box>
        </Column>
        <Column width="4/5">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">4/5</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="1/5">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">1/5</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="1/4">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">1/4</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="1/3">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">1/3</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="2/5">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">2/5</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="1/2">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">1/2</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="3/5">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">3/5</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="2/3">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">2/3</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="3/4">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">3/4</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="4/5">
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">4/5</Title>
          </Box>
        </Column>
        <Column>
          <Box
            padding="2u"
            background="neutralLow"
            borderRadius="large"
            height="full"
          >
            <Title size="xsmall">fluid</Title>
          </Box>
        </Column>
      </Columns>
    </Rows>
  );
};
