import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const cardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, reference) => (
    <div className={cn("p-6 pt-0", className)} ref={reference} {...props} />
  )
);
cardContent.displayName = "CardContent";

export { cardContent as CardContent };
