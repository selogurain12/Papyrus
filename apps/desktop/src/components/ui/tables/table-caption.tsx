import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const tableCaption = forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, reference) => (
  <caption
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    ref={reference}
    {...props}
  />
));
tableCaption.displayName = "TableCaption";

export { tableCaption as TableCaption };
