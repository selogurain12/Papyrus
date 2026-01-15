import React, { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

import { useFormField } from "./form";

const formDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, reference) => {
    const { formDescriptionId } = useFormField();

    return (
      <p
        className={cn("text-sm text-muted-foreground", className)}
        id={formDescriptionId}
        ref={reference}
        {...props}
      />
    );
  }
);
formDescription.displayName = "FormDescription";

export { formDescription as FormDescription };
