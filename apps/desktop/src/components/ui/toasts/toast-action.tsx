import { Action } from "@radix-ui/react-toast";
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const toastAction = forwardRef<
  React.ComponentRef<typeof Action>,
  React.ComponentPropsWithoutRef<typeof Action>
>(({ className, ...props }, reference) => (
  <Action
    className={cn(
      // eslint-disable-next-line max-len
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    ref={reference}
    {...props}
  />
));
toastAction.displayName = Action.displayName;

export { toastAction as ToastAction };
