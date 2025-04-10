import { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import { Input } from "../ui/input";
import { FormFieldType } from "./type";

type FileFieldProps<TFieldValues extends FieldValues> = {
  input: FormFieldType<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

export const FileField = <TFieldValues extends FieldValues>({
  input,
  field,
}: FileFieldProps<TFieldValues>) => {
  return (
    <Input
      {...field}
      className="border-secondary-500 text-surface file:text-surface focus:shadow-inset relative m-0 block w-full min-w-0 flex-auto cursor-pointer items-center rounded border border-solid bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit  file:bg-transparent file:px-3 file:py-[0.32rem] focus:border-primary focus:text-gray-700 focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"
      placeholder={input.placeholder || "Please enter a value"}
      type={input.type}
      disabled={input.disabled}
      accept={input.accept}
    />
  );
};
