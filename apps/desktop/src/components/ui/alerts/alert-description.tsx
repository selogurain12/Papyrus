import React, { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

const alertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, reference) => (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)} ref={reference} {...props} />
  )
);
alertDescription.displayName = "AlertDescription";

export { alertDescription as AlertDescription };
