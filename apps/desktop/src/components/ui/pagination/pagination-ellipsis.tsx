import React, { type ComponentProps } from "react";
import { MoreHorizontal } from "lucide-react";

import { cn } from "../../../lib/utils";

function paginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
paginationEllipsis.displayName = "PaginationEllipsis";

export { paginationEllipsis as PaginationEllipsis };
