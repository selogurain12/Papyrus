import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const cardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, reference) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} ref={reference} {...props} />
  )
);
cardHeader.displayName = "CardHeader";

export { cardHeader as CardHeader };
