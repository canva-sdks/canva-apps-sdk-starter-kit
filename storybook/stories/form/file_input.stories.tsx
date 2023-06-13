import { FileInputItem, Rows } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useState } from "react";
import { FileInput } from "../../index";

/**
 * `<FileInput/>` is a form component that allows users to upload a file (or multiple) to support their current task.
 * The button opens up the native file explorer on the machine.
 *
 * > Use within a `<FormField/>` component for best usability and accessibility where possible.
 */
const meta: Meta<typeof FileInput> = {
  title: "@canva/app-ui-kit/Form/File Input",
  component: FileInput,
  tags: ["autodocs"],
  args: { multiple: false, accept: ["image/png"] },
};

export default meta;
type Story = StoryObj<typeof FileInput>;

export const SimpleFileInput: Story = {};
export const DisabledFileInput: Story = {
  args: {
    disabled: true,
  },
};
export const StretchedFileInput: Story = {
  args: { stretchButton: true },
};
export const FileInputThatAcceptsMultipleFiles: Story = {
  args: { multiple: true },
};
/**
 * This example demonstrates how to use FileInput together.
 * This is a working interactive example.
 */
export const FileInputWithFileInputItems = () => {
  const [files, setFiles] = useState<File[]>([
    new File(["exampleFile1"], "exampleFile1.txt"),
    new File(["exampleFile2"], "exampleFile2.txt"),
  ]);

  return (
    <Rows spacing={"1u"}>
      <FileInput
        multiple={true}
        onDropAcceptedFiles={(files) => {
          setFiles(files);
        }}
        stretchButton
      ></FileInput>
      {files.map((file) => (
        <FileInputItem
          key={file.name}
          label={file.name}
          onDeleteClick={() => {
            setFiles((savedFiles) =>
              savedFiles.filter((savedFile) => savedFile.name !== file.name)
            );
          }}
        ></FileInputItem>
      ))}
    </Rows>
  );
};
