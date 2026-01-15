import { ChevronLast } from "lucide-react";

import { cn } from "../../../lib/utils";

import { PaginationLink, type PaginationLinkProps } from "./pagination-link";
import React from "react";

function paginationLast({ className, disabled, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to last page"
      className={cn("gap-1 pr-2.5", className)}
      disabled={disabled}
      size="default"
      {...props}
    >
      <span>Dernier</span>
      <ChevronLast className="h-4 w-4" />
    </PaginationLink>
  );
}
paginationLast.displayName = "PaginationLast";

export { paginationLast as PaginationLast };
