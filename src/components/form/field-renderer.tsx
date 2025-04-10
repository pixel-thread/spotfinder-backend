import { SelectField } from "./select-field";
import { TextField } from "./text-fields";
import { PasswordField } from "./password-field";
import { NumberField } from "./number-field";
import { DateField } from "./date-fields";
import { FormFieldType } from "./type";
import { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import { TextAreaFields } from "./text-area-field";
import { FileField } from "./file-field";

type FieldRendererProps<TFieldValues extends FieldValues> = {
  input: FormFieldType<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

export const FieldRenderer = <TFieldValues extends FieldValues>({
  input,
  field,
}: FieldRendererProps<TFieldValues>) => {
  switch (input.type) {
    case "select":
      return <SelectField input={input} field={field} />;
    case "password":
      return <PasswordField input={input} field={field} />;
    case "number":
      return <NumberField input={input} field={field} />;
    case "date":
      return <DateField input={input} field={field} />;
    case "textarea":
      return <TextAreaFields input={input} field={field} />;
    case "file":
      return <FileField input={input} field={field} />;
    default:
      return <TextField input={input} field={field} />;
  }
};
