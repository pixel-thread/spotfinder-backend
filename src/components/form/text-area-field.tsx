import { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import { FormFieldType } from "./type";
import { Textarea } from "../ui/textarea";

type TextAreaProps<TFieldValues extends FieldValues> = {
  input: FormFieldType<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

export const TextAreaFields = <TFieldValues extends FieldValues>({
  input,
  field,
}: TextAreaProps<TFieldValues>) => {
  return (
    <Textarea
      {...field}
      className="flex"
      rows={input.rows || 4}
      placeholder={input.placeholder || "Please enter a value"}
      disabled={input.disabled}
    />
  );
};
