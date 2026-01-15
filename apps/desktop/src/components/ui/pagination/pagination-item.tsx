import React, { forwardRef, type ComponentProps } from "react";

import { cn } from "../../../lib/utils";

const paginationItem = forwardRef<HTMLLIElement, ComponentProps<"li">>(
  ({ className, ...props }, reference) => (
    <li className={cn("", className)} ref={reference} {...props} />
  )
);
paginationItem.displayName = "PaginationItem";

export { paginationItem as PaginationItem };
