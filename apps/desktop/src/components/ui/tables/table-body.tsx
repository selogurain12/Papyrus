import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const tableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, reference) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} ref={reference} {...props} />
));
tableBody.displayName = "TableBody";

export { tableBody as TableBody };
