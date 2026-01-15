import React, { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

const alertTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, reference) => (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      ref={reference}
      {...props}
    />
  )
);
alertTitle.displayName = "AlertTitle";

export { alertTitle as AlertTitle };
