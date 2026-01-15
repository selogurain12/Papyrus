import { Separator } from "@radix-ui/react-select";
import React, { forwardRef } from "react";
import { cn } from "../../../../src/lib/utils";

const selectSeparator = forwardRef<
  React.ComponentRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, reference) => (
  <Separator className={cn("-mx-1 my-1 h-px bg-muted", className)} ref={reference} {...props} />
));
selectSeparator.displayName = Separator.displayName;
