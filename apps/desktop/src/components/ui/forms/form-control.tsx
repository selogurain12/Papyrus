import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";

import { useFormField } from "./form";

const formControl = forwardRef<ComponentRef<typeof Slot>, ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, reference) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        aria-describedby={
          error ? `${formDescriptionId} ${formMessageId}` : String(formDescriptionId)
        }
        aria-invalid={Boolean(error)}
        id={formItemId}
        ref={reference}
        {...props}
      />
    );
  }
);
formControl.displayName = "FormControl";

export { formControl as FormControl };
