import { format, parse } from "date-fns";
import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormControl } from "../ui/form";
import { FormFieldType } from "./type";
import { Button } from "../ui/button";
import { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

type DateFieldProps<TFieldValues extends FieldValues> = {
  input: FormFieldType<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
};

export const DateField = <TFieldValues extends FieldValues>({
  input,
  field,
}: DateFieldProps<TFieldValues>) => {
  return (
    <Popover>
      <PopoverTrigger disabled={input.disabled} asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between pl-3 text-left font-normal",
              !field.value && "text-muted-foreground",
            )}
          >
            {field.value ? (
              typeof field.value === "string" && field.value.includes("/") ? (
                format(
                  parse(field.value, "dd/MM/yyyy", new Date()),
                  "yyyy-MM-dd",
                )
              ) : (
                format(field.value, "yyyy-MM-dd")
              )
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(field.value)}
          onSelect={field.onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
