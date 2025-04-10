import { FormLabel } from "../ui/form";

type Props = {
  label: string;
  required: boolean;
};
export const FormFieldLabel = ({ label, required }: Props) => {
  return (
    <FormLabel className="flex items-center space-x-1">
      <div>{label}</div>
      {required && <span className="text-red-500">*</span>}
    </FormLabel>
  );
};
