import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const cardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, reference) => (
    <div className={cn("flex items-center p-6 pt-0", className)} ref={reference} {...props} />
  )
);
cardFooter.displayName = "CardFooter";

export { cardFooter as CardFooter };
