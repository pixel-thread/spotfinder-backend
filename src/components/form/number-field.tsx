import { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import { Input } from "../ui/input";
import { FormFieldType } from "./type";

type NumberFieldProps<TFieldValues extends FieldValues> = {
  input: FormFieldType<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

export const NumberField = <TFieldValues extends FieldValues>({
  input,
  field,
}: NumberFieldProps<TFieldValues>) => {
  return (
    <Input
      {...field}
      className="flex"
      disabled={input.disabled}
      placeholder={input.placeholder || "Please enter a value"}
      inputMode="numeric"
      type="number"
      onChange={(e) => {
        const value = Number(e.target.value);
        field.onChange(value);
      }}
    />
  );
};
