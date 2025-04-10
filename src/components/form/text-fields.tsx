import { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import { Input } from "../ui/input";
import { FormFieldType } from "./type";

type TextFieldProps<TFieldValues extends FieldValues> = {
  input: FormFieldType<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

export const TextField = <TFieldValues extends FieldValues>({
  input,
  field,
}: TextFieldProps<TFieldValues>) => {
  return (
    <Input
      {...field}
      placeholder={input.placeholder || "Please enter a value"}
      type={input.type ?? "text"}
      disabled={input.disabled}
    />
  );
};
