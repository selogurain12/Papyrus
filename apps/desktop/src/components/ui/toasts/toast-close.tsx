import { Close } from "@radix-ui/react-toast";
import React, { forwardRef } from "react";
import { LuX } from "react-icons/lu";

import { cn } from "../../../lib/utils";

const toastClose = forwardRef<
  React.ComponentRef<typeof Close>,
  React.ComponentPropsWithoutRef<typeof Close>
>(({ className, ...props }, reference) => (
  <Close
    className={cn(
      // eslint-disable-next-line max-len
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    ref={reference}
    toast-close=""
    {...props}
  >
    <LuX className="h-4 w-4" />
  </Close>
));
toastClose.displayName = Close.displayName;

export { toastClose as ToastClose };
