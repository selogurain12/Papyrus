import { Item } from "@radix-ui/react-accordion";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../../lib/utils";

const accordionItem = forwardRef<ComponentRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(
  ({ className, ...props }, reference) => (
    <Item className={cn("border-b", className)} ref={reference} {...props} />
  )
);
accordionItem.displayName = "AccordionItem";

export { accordionItem as AccordionItem };
