export interface OptionsT {
  label: string;
  value: string | number | boolean;
}
type InputTypeT =
  | "number"
  | "select"
  | "text"
  | "textarea"
  | "file"
  | "password"
  | "date"
  | "otp"
  | "email";

export interface FormFieldType<T> {
  name: keyof T;
  label?: string;
  required?: boolean;
  defaultValue?: string | number | boolean | Date | undefined;
  rows?: number;
  multiline?: boolean;
  type?: InputTypeT;
  disabled?: boolean;
  options?: OptionsT[];
  placeholder?: string;
  accept?: HTMLInputElement["accept"];
}
