import { Corner, Root, Viewport } from "@radix-ui/react-scroll-area";
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

import { ScrollBar } from "./scroll-bar";

const scrollArea = forwardRef<
  React.ComponentRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, children, ...props }, reference) => (
  <Root className={cn("relative overflow-hidden", className)} ref={reference} {...props}>
    <Viewport className="h-full w-full rounded-[inherit]">{children}</Viewport>
    <ScrollBar />
    <Corner />
  </Root>
));
scrollArea.displayName = Root.displayName;

export { scrollArea as ScrollArea };
