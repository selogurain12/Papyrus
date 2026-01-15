import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const tableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, reference) => (
    <th
      className={cn(
        // eslint-disable-next-line max-len
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      ref={reference}
      {...props}
    />
  )
);
tableHead.displayName = "TableHead";

export { tableHead as TableHead };
