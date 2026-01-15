import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const tableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, reference) => (
  <thead className={cn("[&_tr]:border-b", className)} ref={reference} {...props} />
));
tableHeader.displayName = "TableHeader";

export { tableHeader as TableHeader };
