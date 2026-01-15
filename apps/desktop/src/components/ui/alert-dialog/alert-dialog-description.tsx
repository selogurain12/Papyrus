import { Description } from "@radix-ui/react-alert-dialog";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../../lib/utils";

const alertDialogDescription = forwardRef<
  ComponentRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, reference) => (
  <Description
    className={cn("text-sm text-muted-foreground", className)}
    ref={reference}
    {...props}
  />
));
alertDialogDescription.displayName = Description.displayName;

export { alertDialogDescription as AlertDialogDescription };
