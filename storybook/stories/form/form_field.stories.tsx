import {
  Checkbox,
  CheckboxGroup,
  MultilineInput,
  NumberInput,
  RadioGroup,
  SegmentedControl,
  TextInput,
} from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FormField, Select } from "../../index";

/**
 * `<FormField/>` presents a form control to users with a Form Label and optional Form Description.
 * When rendering a label or a description for a form control, it's important to link them with accessibility in mind.
 * This component takes care of generating a unique ID and setting it to the DOM element, then linking it to the form control
 * automatically.
 *
 * The control prop can be any other form input component.
 *
 * > **_NOTE:_** The control prop expects a function which returns the component used as the control.
 * This function passes down `id`, `value`, and `error` as parameters from the `<FormField/>` component.
 * Ensure to pass these parameters down to the control to connect the components together.
 */
const meta: Meta<typeof FormField> = {
  title: "@canva/app-ui-kit/Form/Form Field",
  component: FormField,
  tags: ["autodocs"],
  args: {
    label: "Form field label",
    control: (props) => (
      <Select
        {...props}
        options={[
          { value: "blueberry", label: "Blueberry" },
          { value: "apple", label: "Apple" },
          { value: "strawberry", label: "Strawberry" },
        ]}
      />
    ),
    description: "Form field description",
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const SimpleFormField: Story = {
  args: {
    label: "Form field label",
    description: "Form field description",
    control: (props) => (
      <Select
        {...props}
        options={[
          { value: "blueberry", label: "Blueberry" },
          { value: "apple", label: "Apple" },
          { value: "strawberry", label: "Strawberry" },
        ]}
      />
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `
<FormField
  label="Form field label"
  description="Form field description"
  control={(props) => (
    <Select
      {...props} // <--- pass props down id, value and error to connect Select component to FormField
      options={[
        { value: "blueberry", label: "Blueberry" },
        { value: "apple", label: "Apple" },
        { value: "strawberry", label: "Strawberry" },
      ]}
    />
  )}
/>`,
      },
    },
  },
};

export const FormFieldWithError: Story = {
  args: {
    description: "Description is not visible when error is true",
    error: true,
  },
};
export const FormFieldWithCustomErrorMessage: Story = {
  args: {
    description: "Description is not visible when custom error message exists",
    error: "Custom error message",
  },
};

export const FormFieldWithCheckboxAsControl = (_) => {
  return (
    <FormField
      label={"Checkbox"}
      description={"FormField with a Checkbox component as the control"}
      control={(props) => <Checkbox {...props} label="Checkbox" />}
    />
  );
};
export const FormFieldWithCheckboxGroupAsControl = (_) => {
  return (
    <FormField
      label={"CheckboxGroup"}
      description={"FormField with a CheckboxGroup component as the control"}
      control={(props) => (
        <CheckboxGroup
          id={props.id}
          options={[
            { value: "blueberry", label: "Blueberry" },
            { value: "apple", label: "Apple" },
            { value: "strawberry", label: "Strawberry" },
          ]}
        />
      )}
    />
  );
};
export const FormFieldWithMultilineInputAsControl = (_) => {
  return (
    <FormField
      label={"MultilineInput"}
      description={"FormField with a MultilineInput component as the control"}
      control={(props) => <MultilineInput {...props} />}
    />
  );
};
export const FormFieldWithNumberInputAsControl = (_) => {
  return (
    <FormField
      label={"NumberInput"}
      description={"FormField with a NumberInput component as the control"}
      control={(props) => (
        <NumberInput
          {...props}
          hasSpinButtons={true}
          decrementAriaLabel={"decrement number by 5"}
          incrementAriaLabel={"increment number by 5"}
          step={5}
          defaultValue={5}
        />
      )}
    />
  );
};
export const FormFieldWithRadioGroupAsControl = (_) => {
  return (
    <FormField
      label={"RadioGroup"}
      description={"FormField with a RadioGroup component as the control"}
      control={(props) => (
        <RadioGroup
          id={props.id}
          options={[
            { value: "blueberry", label: "Blueberry" },
            { value: "apple", label: "Apple" },
            { value: "strawberry", label: "Strawberry" },
          ]}
          onChange={() => 0}
        />
      )}
    />
  );
};
export const FormFieldWithSegmentedControlAsControl = (_) => {
  return (
    <FormField
      label={"SegmentedControl"}
      description={"FormField with a SegmentedControl component as the control"}
      control={(props) => (
        <SegmentedControl
          id={props.id}
          options={[
            { value: "blueberry", label: "Blueberry" },
            { value: "apple", label: "Apple" },
            { value: "strawberry", label: "Strawberry" },
          ]}
        />
      )}
    />
  );
};
export const FormFieldWithSelectAsControl = (_) => {
  return (
    <FormField
      label={"Select"}
      description={"FormField with a Select component as the control"}
      control={(props) => (
        <Select
          {...props}
          options={[
            { value: "blueberry", label: "Blueberry" },
            { value: "apple", label: "Apple" },
            { value: "strawberry", label: "Strawberry" },
          ]}
        />
      )}
    />
  );
};
export const FormFieldWithTextInputAsControl = (_) => {
  return (
    <FormField
      label={"TextInput"}
      description={"FormField with a TextInput component as the control"}
      control={(props) => <TextInput id={props.id} />}
    />
  );
};
