import { ChevronFirst } from "lucide-react";

import { cn } from "../../../lib/utils";

import { PaginationLink, type PaginationLinkProps } from "./pagination-link";
import React from "react";

function paginationFirst({ className, disabled, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to first page"
      className={cn("gap-1 pl-2.5", className)}
      disabled={disabled}
      size="default"
      {...props}
    >
      <ChevronFirst className="h-4 w-4" />
      <span>Premier</span>
    </PaginationLink>
  );
}
paginationFirst.displayName = "PaginationFirst";

export { paginationFirst as PaginationFirst };
