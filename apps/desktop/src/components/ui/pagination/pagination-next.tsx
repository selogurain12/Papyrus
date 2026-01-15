import { ChevronRight } from "lucide-react";

import { cn } from "../../../lib/utils";

import { PaginationLink, type PaginationLinkProps } from "./pagination-link";
import React from "react";

function paginationNext({ className, disabled, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("gap-1 pr-2.5", className)}
      disabled={disabled}
      size="default"
      {...props}
    >
      <span>Suivant</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}
paginationNext.displayName = "PaginationNext";

export { paginationNext as PaginationNext };
