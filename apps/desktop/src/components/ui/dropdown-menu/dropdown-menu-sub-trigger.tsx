import React, { forwardRef } from "react";
import { SubTrigger } from "@radix-ui/react-dropdown-menu";
import { LuChevronRight } from "react-icons/lu";

import { cn } from "../../../lib/utils";

const dropdownMenuSubTrigger = forwardRef<
  React.ComponentRef<typeof SubTrigger>,
  React.ComponentPropsWithoutRef<typeof SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset = false, children, ...props }, reference) => (
  <SubTrigger
    className={cn(
      // eslint-disable-next-line max-len
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      (inset ?? false) && "pl-8",
      className
    )}
    ref={reference}
    {...props}
  >
    {children}
    <LuChevronRight className="ml-auto h-4 w-4" />
  </SubTrigger>
));
dropdownMenuSubTrigger.displayName = SubTrigger.displayName;

export { dropdownMenuSubTrigger as DropdownMenuSubTrigger };
