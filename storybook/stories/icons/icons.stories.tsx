import { Grid, Rows, Text, Title } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { CogIcon } from "../../index";
import { iconGroups } from "./icon_groups";

const meta: Meta<typeof CogIcon> = {
  title: "@canva/app-ui-kit/Icons/Icons",
  component: CogIcon,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CogIcon>;

export const SimpleIcon: Story = {};

export const AllIcons = (_) => (
  <Rows spacing="3u">
    {[...iconGroups].map(([groupName, icons]) => {
      return (
        <Rows spacing={"1.5u"} key={groupName}>
          <Title size="small">{groupName}</Title>
          <Grid spacing="3u" columns={6} alignY="center">
            {icons.map((Icon) => (
              <Rows spacing="1u" align="center" key={Icon.name}>
                <Icon />
                <Text>{Icon.name}</Text>
              </Rows>
            ))}
          </Grid>
        </Rows>
      );
    })}
  </Rows>
);
