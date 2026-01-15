import React, { forwardRef } from "react";
import { CheckboxItem, ItemIndicator } from "@radix-ui/react-dropdown-menu";
import { LuCheck } from "react-icons/lu";

import { cn } from "../../../lib/utils";

const dropdownMenuCheckboxItem = forwardRef<
  React.ComponentRef<typeof CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof CheckboxItem>
>(({ className, children, checked, ...props }, reference) => (
  <CheckboxItem
    checked={checked}
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
        <LuCheck className="h-4 w-4" />
      </ItemIndicator>
    </span>
    {children}
  </CheckboxItem>
));
dropdownMenuCheckboxItem.displayName = CheckboxItem.displayName;

export { dropdownMenuCheckboxItem as DropdownMenuCheckboxItem };
