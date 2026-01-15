import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { Indicator, Root } from "@radix-ui/react-progress";

import { cn } from "../../lib/utils";

const progress = forwardRef<ComponentRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, value, ...props }, reference) => (
    <Root
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      ref={reference}
      {...props}
    >
      <Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (Number(value) || 0)}%)` }}
      />
    </Root>
  )
);
progress.displayName = Root.displayName;

export { progress as Progress };
