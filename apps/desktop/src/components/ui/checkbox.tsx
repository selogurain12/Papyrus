import { Indicator, Root } from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import React, { forwardRef } from "react";

import { cn } from "../../lib/utils";

const checkbox = forwardRef<
  React.ComponentRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, reference) => (
  <Root
    className={cn(
      // eslint-disable-next-line max-len
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    ref={reference}
    {...props}
  >
    <Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </Indicator>
  </Root>
));
checkbox.displayName = Root.displayName;

export { checkbox as Checkbox };
