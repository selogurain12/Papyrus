import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { Content } from "@radix-ui/react-tabs";

import { cn } from "../../../lib/utils";

const tabsContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, reference) => (
  <Content
    className={cn(
      // eslint-disable-next-line max-len
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    ref={reference}
    {...props}
  />
));
tabsContent.displayName = Content.displayName;

export { tabsContent as TabsContent };
