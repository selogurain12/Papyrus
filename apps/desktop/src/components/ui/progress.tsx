import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { Indicator, Root } from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

const progress = forwardRef<ComponentRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, value = 0, ...props }, reference) => {
    const numericValue = Number(value);

    const colorClass = cn({
      "bg-red-600": numericValue < 30,
      "bg-yellow-500": numericValue >= 30 && numericValue < 70,
      "bg-green-600": numericValue >= 70,
    });

    return (
      <Root
        ref={reference}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
        {...props}
      >
        <Indicator
          className={cn("h-full w-full flex-1 transition-all", colorClass)}
          style={{ transform: `translateX(-${100 - numericValue}%)` }}
        />
      </Root>
    );
  }
);

progress.displayName = Root.displayName;

export { progress as Progress };
