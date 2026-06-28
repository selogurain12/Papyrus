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
      "peer relative flex size-4 shrink-0 items-center justify-center rounded-sm border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[state=checked]:border-primary data-[state=checked]:bg-black data-[state=checked]:text-white dark:data-[state=checked]:bg-primary",
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
