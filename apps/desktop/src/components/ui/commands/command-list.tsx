import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { CommandList } from "cmdk";

import { cn } from "../../../lib/utils";

const commandList = forwardRef<
  ComponentRef<typeof CommandList>,
  ComponentPropsWithoutRef<typeof CommandList>
>(({ className, ...props }, reference) => (
  <CommandList
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    ref={reference}
    {...props}
  />
));

commandList.displayName = CommandList.displayName;
export { commandList as CommandList };
