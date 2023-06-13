import { Text } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import { TextPlaceholder } from "../../index";

const meta: Meta<typeof TextPlaceholder> = {
  title: "@canva/app-ui-kit/Progress/Placeholder/Text Placeholder",
  component: TextPlaceholder,
  tags: ["autodocs"],
  args: { size: "medium" },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const SimpleTextPlaceholder: Story = {};
