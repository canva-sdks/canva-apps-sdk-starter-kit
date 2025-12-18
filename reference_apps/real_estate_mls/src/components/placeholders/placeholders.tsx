import {
  Box,
  Column,
  Columns,
  Placeholder,
  Rows,
  TextPlaceholder,
  TitlePlaceholder,
} from "@canva/app-ui-kit";
import React from "react";

export const ListPlaceholder = () => (
  <Columns spacing="2u" align="start" alignY="stretch">
    <Column width="content">
      <Box width="full" height="full">
        <div
          style={{
            height: "60px",
            width: "60px",
            paddingLeft: "var(--ui-kit-space-050)",
          }}
        >
          <Placeholder shape="rectangle" />
        </div>
      </Box>
    </Column>
    <Column width="fluid">
      <Rows spacing="0">
        <TitlePlaceholder />
        <TextPlaceholder />
      </Rows>
    </Column>
  </Columns>
);

export const GridPlaceholder = () => (
  <Columns spacing="2u" alignY="stretch">
    <Column width="1/2">
      <Rows spacing="1u">
        <Box width="full" height="full">
          <div style={{ height: "120px" }}>
            <Placeholder shape="rectangle" />
          </div>
        </Box>
        <Rows spacing="0">
          <TitlePlaceholder />
          <TitlePlaceholder size="small" />
        </Rows>
      </Rows>
    </Column>
    <Column width="1/2">
      <Rows spacing="1u">
        <Box width="full" height="full">
          <div style={{ height: "120px" }}>
            <Placeholder shape="rectangle" />
          </div>
        </Box>
        <Rows spacing="0">
          <TitlePlaceholder />
          <TitlePlaceholder size="small" />
        </Rows>
      </Rows>
    </Column>
  </Columns>
);
