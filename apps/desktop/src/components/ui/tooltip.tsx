import { Content, Provider, Root, Trigger } from "@radix-ui/react-tooltip";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/utils";

const tooltipProvider = Provider;

const tooltip = Root;

const tooltipTrigger = Trigger;

const tooltipContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, sideOffset = 4, ...props }, reference) => (
  <Content
    className={cn(
      // eslint-disable-next-line max-len
      "z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    ref={reference}
    sideOffset={sideOffset}
    {...props}
  />
));
tooltipContent.displayName = Content.displayName;

export {
  tooltip as Tooltip,
  tooltipTrigger as TooltipTrigger,
  tooltipContent as TooltipContent,
  tooltipProvider as TooltipProvider,
};
