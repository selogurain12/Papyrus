import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { CommandItem } from "cmdk";

import { cn } from "../../../lib/utils";

const commandItem = forwardRef<
  ComponentRef<typeof CommandItem>,
  ComponentPropsWithoutRef<typeof CommandItem>
>(({ className, ...props }, reference) => (
  <CommandItem
    className={cn(
      // eslint-disable-next-line max-len
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className,
      props.disabled !== undefined && props.disabled && "pointer-events-none opacity-50"
    )}
    ref={reference}
    {...props}
  />
));

commandItem.displayName = CommandItem.displayName;

export { commandItem as CommandItem };
