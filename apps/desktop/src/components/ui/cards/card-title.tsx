import React, { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

const cardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>, reference) => (
    <h3
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      ref={reference}
      {...rest}
    />
  )
);

cardTitle.displayName = "CardTitle";

export { cardTitle as CardTitle };
