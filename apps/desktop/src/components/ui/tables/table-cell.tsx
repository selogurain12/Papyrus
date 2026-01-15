import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const tableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, reference) => (
    <td
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      ref={reference}
      {...props}
    />
  )
);
tableCell.displayName = "TableCell";

export { tableCell as TableCell };
