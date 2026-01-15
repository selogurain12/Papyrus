import { Content } from "@radix-ui/react-accordion";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../../lib/utils";

const accordionContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, children, ...props }, reference) => (
  <Content
    // eslint-disable-next-line max-len
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    ref={reference}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </Content>
));

accordionContent.displayName = Content.displayName;

export { accordionContent as AccordionContent };
