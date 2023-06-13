import type { Meta, StoryObj } from "@storybook/react";
import { FileInputItem } from "../../index";
import { FileInputWithFileInputItems } from "./file_input.stories";

/**
 * `<FileInputItem/>` is a component that shows an uploaded item.
 *
 * This component is intended to be used with `<FileInput/>`.
 * The <FileInput/> component renders a button which is used to select files to upload. The `<FileInputItem/>`
 * component can then be used to render the list of uploaded files.
 */
const meta: Meta<typeof FileInputItem> = {
  title: "@canva/app-ui-kit/Form/File Input Item",
  component: FileInputItem,
  tags: ["autodocs"],
  args: { label: "exampleFileName.png" },
};

export default meta;
type Story = StoryObj<typeof FileInputItem>;

export const SimpleFileInputItem: Story = {};
export const DisabledFileInputItem: Story = {
  args: {
    disabled: true,
  },
};
export const FileInputItemsWithFileInput = FileInputWithFileInputItems;
