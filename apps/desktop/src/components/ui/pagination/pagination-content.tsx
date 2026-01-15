import React, { forwardRef, type ComponentProps } from "react";

import { cn } from "../../../lib/utils";

const paginationContent = forwardRef<HTMLUListElement, ComponentProps<"ul">>(
  ({ className, ...props }, reference) => (
    <ul className={cn("flex flex-row items-center gap-1", className)} ref={reference} {...props} />
  )
);
paginationContent.displayName = "PaginationContent";

export { paginationContent as PaginationContent };
