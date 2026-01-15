import React, { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

const card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, reference) => (
    <div
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      ref={reference}
      {...props}
    />
  )
);
card.displayName = "Card";

export { card as Card };
