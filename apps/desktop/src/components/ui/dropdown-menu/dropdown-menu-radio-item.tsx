import React, { forwardRef } from "react";
import { ItemIndicator, RadioItem } from "@radix-ui/react-dropdown-menu";
import { LuCircle } from "react-icons/lu";

import { cn } from "../../../lib/utils";

const dropdownMenuRadioItem = forwardRef<
  React.ComponentRef<typeof RadioItem>,
  React.ComponentPropsWithoutRef<typeof RadioItem>
>(({ className, children, ...props }, reference) => (
  <RadioItem
    className={cn(
      // eslint-disable-next-line max-len
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    ref={reference}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <LuCircle className="h-2 w-2 fill-current" />
      </ItemIndicator>
    </span>
    {children}
  </RadioItem>
));
dropdownMenuRadioItem.displayName = RadioItem.displayName;

export { dropdownMenuRadioItem as DropdownMenuRadioItem };
