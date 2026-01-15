import { Viewport } from "@radix-ui/react-navigation-menu";
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const navigationMenuViewport = forwardRef<
  React.ComponentRef<typeof Viewport>,
  React.ComponentPropsWithoutRef<typeof Viewport>
>(({ className, ...props }, reference) => (
  <div className={cn("absolute right-0 top-full flex justify-center")}>
    <Viewport
      className={cn(
        // eslint-disable-next-line max-len
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={reference}
      {...props}
    />
  </div>
));
navigationMenuViewport.displayName = Viewport.displayName;

export { navigationMenuViewport as NavigationMenuViewport };
