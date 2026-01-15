import { Root } from "@radix-ui/react-separator";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/utils";

const separator = forwardRef<ComponentRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, reference) => (
    <Root
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      decorative={decorative}
      orientation={orientation}
      ref={reference}
      {...props}
    />
  )
);
separator.displayName = Root.displayName;

export { separator as Separator };
