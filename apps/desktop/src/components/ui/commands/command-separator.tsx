import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { CommandSeparator } from "cmdk";

import { cn } from "../../../lib/utils";

const commandSeparator = forwardRef<
  ComponentRef<typeof CommandSeparator>,
  ComponentPropsWithoutRef<typeof CommandSeparator>
>(({ className, ...props }, reference) => (
  <CommandSeparator className={cn("-mx-1 h-px bg-border", className)} ref={reference} {...props} />
));
commandSeparator.displayName = CommandSeparator.displayName;

export { commandSeparator as CommandSeparator };
