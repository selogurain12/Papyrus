import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const tableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, reference) => (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      ref={reference}
      {...props}
    />
  )
);
tableRow.displayName = "TableRow";

export { tableRow as TableRow };
