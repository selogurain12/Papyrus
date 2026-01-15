import React, { forwardRef } from "react";
import { Command } from "cmdk";

import { cn } from "../../../lib/utils";

const command = forwardRef<
  React.ComponentRef<typeof Command>,
  React.ComponentPropsWithoutRef<typeof Command>
>(({ className, ...props }, reference) => (
  <Command
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    ref={reference}
    {...props}
  />
));
command.displayName = Command.displayName;

export { command as Command };
