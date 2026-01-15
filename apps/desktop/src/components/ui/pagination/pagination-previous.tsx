import { ChevronLeft } from "lucide-react";

import { cn } from "../../../lib/utils";

import { PaginationLink, type PaginationLinkProps } from "./pagination-link";
import React from "react";

function paginationPrevious({ className, disabled, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("gap-1 pl-2.5", className)}
      disabled={disabled}
      size="default"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Précédent</span>
    </PaginationLink>
  );
}
paginationPrevious.displayName = "PaginationPrevious";

export { paginationPrevious as PaginationPrevious };
