import { Indicator } from "@radix-ui/react-navigation-menu";
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const navigationMenuIndicator = forwardRef<
  React.ComponentRef<typeof Indicator>,
  React.ComponentPropsWithoutRef<typeof Indicator>
>(({ className, ...props }, reference) => (
  <Indicator
    className={cn(
      // eslint-disable-next-line max-len
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    ref={reference}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </Indicator>
));
navigationMenuIndicator.displayName = Indicator.displayName;

export { navigationMenuIndicator as NavigationMenuIndicator };
