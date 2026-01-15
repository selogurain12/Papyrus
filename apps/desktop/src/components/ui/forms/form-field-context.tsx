import React, { createContext } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormFieldContextValue<
  TfieldValues extends FieldValues = FieldValues,
  Tname extends FieldPath<TfieldValues> = FieldPath<TfieldValues>,
> {
  name: Tname;
}

 
const FormFieldContext = createContext<FormFieldContextValue>(
   
  {} as FormFieldContextValue
);

function formField<
  TfieldValues extends FieldValues = FieldValues,
  Tname extends FieldPath<TfieldValues> = FieldPath<TfieldValues>,
>({ ...props }: ControllerProps<TfieldValues, Tname>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export { formField as FormField, FormFieldContext };
