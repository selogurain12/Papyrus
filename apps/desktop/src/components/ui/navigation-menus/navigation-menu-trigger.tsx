/* eslint-disable max-len */
import { Trigger } from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import React, { forwardRef } from "react";
import { LuChevronDown } from "react-icons/lu";

import { cn } from "../../../lib/utils";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

const navigationMenuTrigger = forwardRef<
  React.ComponentRef<typeof Trigger>,
  React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, reference) => (
  <Trigger
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    ref={reference}
    {...props}
  >
    {children}{" "}
    <LuChevronDown
      aria-hidden="true"
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
    />
  </Trigger>
));
navigationMenuTrigger.displayName = Trigger.displayName;

export { navigationMenuTrigger as NavigationMenuTrigger, navigationMenuTriggerStyle };
