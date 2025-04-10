import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormControl } from "../ui/form";
import { FormFieldType, OptionsT } from "./type";
import { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";

type SelectFieldProps<TFieldValues extends FieldValues> = {
  input: FormFieldType<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

export const SelectField = <TFieldValues extends FieldValues>({
  input,
  field,
}: SelectFieldProps<TFieldValues>) => {
  return (
    <Select onValueChange={field.onChange} value={field.value ?? ""}>
      <FormControl className="w-full">
        <SelectTrigger disabled={input.disabled}>
          <SelectValue ref={field.ref} placeholder="Select an option" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {input.options?.map((option: OptionsT, i: number) => (
          <SelectItem key={i} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
