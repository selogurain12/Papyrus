import { ScrollAreaScrollbar, ScrollAreaThumb } from "@radix-ui/react-scroll-area";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../../lib/utils";

const scrollBar = forwardRef<
  ComponentRef<typeof ScrollAreaScrollbar>,
  ComponentPropsWithoutRef<typeof ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, reference) => (
  <ScrollAreaScrollbar
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    orientation={orientation}
    ref={reference}
    {...props}
  >
    <ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaScrollbar>
));
scrollBar.displayName = ScrollAreaScrollbar.displayName;

export { scrollBar as ScrollBar };
