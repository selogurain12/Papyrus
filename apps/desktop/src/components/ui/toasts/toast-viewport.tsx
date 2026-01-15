import { Viewport } from "@radix-ui/react-toast";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../../lib/utils";

const toastViewport = forwardRef<
  ComponentRef<typeof Viewport>,
  ComponentPropsWithoutRef<typeof Viewport>
>(({ className, ...props }, reference) => (
  <Viewport
    className={cn(
      // eslint-disable-next-line max-len
      "fixed top-0 z-[60] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    ref={reference}
    {...props}
  />
));
toastViewport.displayName = Viewport.displayName;

export { toastViewport as ToastViewport };
