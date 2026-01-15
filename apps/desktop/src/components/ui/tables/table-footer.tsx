import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const tableFooter = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, reference) => (
  <tfoot
    className={cn("bg-primary font-medium text-primary-foreground", className)}
    ref={reference}
    {...props}
  />
));
tableFooter.displayName = "TableFooter";

export { tableFooter as TableFooter };
