"use client";

import React from "react";
import { SubmitHandler, UseFormReturn, FieldValues } from "react-hook-form";
import { FormFieldType } from "./type";
import { FieldRenderer } from "./field-renderer";
import { FormField, FormItem, FormMessage, Form as SHForm } from "../ui/form";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { FormFieldLabel } from "./form-field-label";

type FormProps<TFieldValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  isLoading?: boolean;
  disabled?: boolean;
  fields: FormFieldType<TFieldValues>[];
  className?: string;
  btnClassName?: string;
  btnText?: string;
  error?: boolean;
  isSubmit?: boolean;
};

export const Form = <TFieldValues extends FieldValues>({
  form,
  fields,
  disabled = false,
  className,
  btnClassName,
  isLoading = false,
  onSubmit,
  btnText = "Submit",
  error = false,
  isSubmit = true,
}: FormProps<TFieldValues>) => {
  const styles = cn(
    "grid px-1 gap-4 w-auto content-center grid-cols-1",
    className,
  );
  return (
    <>
      {!error && (
        <SHForm {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className={styles}
          >
            <FFields
              fields={fields}
              disabled={disabled}
              form={form}
              isLoading={isLoading}
            />
            {isSubmit && (
              <Button
                disabled={!form.formState.isDirty || disabled || isLoading}
                type="submit"
                size="lg"
                className={cn("w-full md:w-auto", btnClassName)}
              >
                {isLoading ? "Loading" : btnText}
              </Button>
            )}
          </form>
        </SHForm>
      )}
    </>
  );
};

type FFieldsProps<TFieldValues extends FieldValues> = {
  fields: FormFieldType<TFieldValues>[];
  disabled?: boolean;
  form: UseFormReturn<TFieldValues>;
  isLoading?: boolean;
};

export const FFields = <TFieldValues extends FieldValues>({
  fields,
  disabled,
  form,
  isLoading,
}: FFieldsProps<TFieldValues>) => {
  return (
    <>
      {fields.map((input, i) => (
        <div key={i}>
          {isLoading ? (
            <Skeleton className="h-14 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary" />
          ) : (
            <FormField
              disabled={disabled}
              // eslint-disable-next-line
              name={input.name as any}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormFieldLabel
                    label={input?.label || ""}
                    required={input.required || false}
                  />
                  <FieldRenderer input={input} field={field} />
                  {/* <FormDescription>{input.description || " "}</FormDescription> */}
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
          )}
        </div>
      ))}
    </>
  );
};
