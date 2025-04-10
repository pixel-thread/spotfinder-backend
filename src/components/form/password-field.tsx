import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { FormFieldType } from "./type";
import { Button } from "../ui/button";
import { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  input: FormFieldType<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

export const PasswordField = <TFieldValues extends FieldValues>({
  input,
  field,
}: PasswordFieldProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  return (
    <div className="relative flex item-center">
      <Input
        {...field}
        ref={ref}
        placeholder={input.placeholder || "Please enter a value"}
        type={showPassword ? "text" : "password"}
        disabled={input.disabled}
        className="pr-10" // Ensures input text does not overlap the button
      />
      <Button
        type="button"
        className="absolute inset-y-0 right-2 flex h-full items-center justify-center px-2 text-gray-500"
        variant="ghost"
        disabled={input.disabled}
        onClick={toggleShowPassword}
        size="icon"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </Button>
    </div>
  );
};
