import type { SelectOption } from "@canva/app-ui-kit";
import { FormField, Select } from "@canva/app-ui-kit";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: SelectOption<string>[];
}

export const SelectField = ({
  value,
  onChange,
  label,
  options,
}: SelectFieldProps) => {
  return (
    <FormField
      label={label}
      value={value}
      control={(props) => (
        <Select {...props} options={options} onChange={onChange} />
      )}
    />
  );
};
