import { List } from "@radix-ui/react-navigation-menu";
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const navigationMenuList = forwardRef<
  React.ComponentRef<typeof List>,
  React.ComponentPropsWithoutRef<typeof List>
>(({ className, ...props }, reference) => (
  <List
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    ref={reference}
    {...props}
  />
));
navigationMenuList.displayName = List.displayName;

export { navigationMenuList as NavigationMenuList };
