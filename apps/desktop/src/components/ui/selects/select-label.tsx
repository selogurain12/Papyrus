import { Label } from "@radix-ui/react-select";
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const selectLabel = forwardRef<
  React.ComponentRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, reference) => (
  <Label
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    ref={reference}
    {...props}
  />
));
selectLabel.displayName = Label.displayName;

export { selectLabel as SelectLabel };
