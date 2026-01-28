import { Trigger, Root, Content, Portal } from "@radix-ui/react-popover";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/utils";

const popover = Root;

const popoverTrigger = Trigger;

const popoverContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, align = "center", sideOffset = 4, ...props }, reference) => (
  <Portal>
    <Content
      align={align}
      className={cn(
        // eslint-disable-next-line max-len
        "z-50 w-72 rounded-md border-gray-300 bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      ref={reference}
      sideOffset={sideOffset}
      {...props}
    />
  </Portal>
));
popoverContent.displayName = Content.displayName;

export { popover as Popover, popoverTrigger as PopoverTrigger, popoverContent as PopoverContent };
