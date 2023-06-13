import { Title } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import { TitlePlaceholder } from "../../index";

const meta: Meta<typeof TitlePlaceholder> = {
  title: "@canva/app-ui-kit/Progress/Placeholder/Title Placeholder",
  component: TitlePlaceholder,
  tags: ["autodocs"],
  args: { size: "medium" },
};

export default meta;
type Story = StoryObj<typeof Title>;

export const SimpleTitlePlaceholder: Story = {};
