import React, { type ComponentProps } from "react";

import { cn } from "../../../lib/utils";

function paginationNav({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      role="navigation"
      {...props}
    />
  );
}
paginationNav.displayName = "PaginationNav";

export { paginationNav as PaginationNav };
