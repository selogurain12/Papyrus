import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, reference) => (
    <div className="relative w-full overflow-auto rounded-2xl border">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        ref={reference}
        {...props}
      />
    </div>
  )
);
table.displayName = "Table";

export { table as Table };
