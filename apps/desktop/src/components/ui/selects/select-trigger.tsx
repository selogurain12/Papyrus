import { Icon, Trigger } from "@radix-ui/react-select";
import React, { forwardRef } from "react";
import { LuChevronDown } from "react-icons/lu";

import { cn } from "../../../lib/utils";

const selectTrigger = forwardRef<
  React.ComponentRef<typeof Trigger>,
  React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, reference) => (
  <Trigger
    className={cn(
      // eslint-disable-next-line max-len
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={reference}
    {...props}
  >
    {children}
    <Icon asChild>
      <LuChevronDown className="h-4 w-4 opacity-50" />
    </Icon>
  </Trigger>
));
selectTrigger.displayName = Trigger.displayName;

export { selectTrigger as SelectTrigger };
