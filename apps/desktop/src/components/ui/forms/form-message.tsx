import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

import { useFormField } from "./form";

const formMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { message?: string }
>(({ className, children, message, ...props }, reference) => {
  const { error, formMessageId } = useFormField();
  const body: React.ReactNode = error
    ? (message !== undefined && message) || String(error.message)
    : children;

  return (
    <p
      className={cn("text-xs text-red-700 italic mt-0", className)}
      id={formMessageId}
      ref={reference}
      {...props}
    >
      {body}
    </p>
  );
});
formMessage.displayName = "FormMessage";

export { formMessage as FormMessage };
