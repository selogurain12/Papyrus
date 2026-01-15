import { Item, ItemIndicator, ItemText } from "@radix-ui/react-select";
import React, { forwardRef } from "react";
import { LuCheck } from "react-icons/lu";

import { cn } from "../../../lib/utils";

const selectItem = forwardRef<
  React.ComponentRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item>
>(({ className, children, ...props }, reference) => (
  <Item
    className={cn(
      // eslint-disable-next-line max-len
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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

    <ItemText>{children}</ItemText>
  </Item>
));
selectItem.displayName = Item.displayName;

export { selectItem as SelectItem };
