import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { Overlay } from "@radix-ui/react-alert-dialog";

import { cn } from "../../../lib/utils";

const alertDialogOverlay = forwardRef<
  ComponentRef<typeof Overlay>,
  ComponentPropsWithoutRef<typeof Overlay>
>(({ className, ...props }, reference) => (
  <Overlay
    className={cn(
      // eslint-disable-next-line max-len
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    ref={reference}
    {...props}
  />
));
alertDialogOverlay.displayName = Overlay.displayName;

export { alertDialogOverlay as AlertDialogOverlay };
