import React, { forwardRef } from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { cn } from "../../../lib/utils";

const dropdownMenuSeparator = forwardRef<
  React.ComponentRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, reference) => (
  <Separator className={cn("-mx-1 my-1 h-px bg-muted", className)} ref={reference} {...props} />
));
dropdownMenuSeparator.displayName = Separator.displayName;

export { dropdownMenuSeparator as DropdownMenuSeparator };
