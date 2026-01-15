import React, { forwardRef } from "react";
import { Item, Link, Root } from "@radix-ui/react-navigation-menu";

import { cn } from "../../../lib/utils";

import { NavigationMenuViewport } from "./navigation-menu-viewport";

const navigationMenu = forwardRef<
  React.ComponentRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, children, ...props }, reference) => (
  <Root
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    ref={reference}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </Root>
));
navigationMenu.displayName = Root.displayName;

const navigationMenuItem = Item;

const navigationMenuLink = Link;

export {
  navigationMenu as NavigationMenu,
  navigationMenuItem as NavigationMenuItem,
  navigationMenuLink as NavigationMenuLink,
};
