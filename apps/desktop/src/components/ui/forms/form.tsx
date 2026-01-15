import { useContext } from "react";
import { FormProvider, useFormContext } from "react-hook-form";

import { FormFieldContext } from "./form-field-context";
import { FormItemContext } from "./form-item";

const form = FormProvider;

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export { useFormField, form as Form };
