/* eslint-disable max-len */
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { Root, Thumb } from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const switchVariants = cva("", {
  variants: {
    size: {
      default: "h-6 w-11",
      large: "h-8 w-14",
    },

    thumbSize: {
      default: "h-5 w-5 data-[state=checked]:translate-x-5",
      large: "h-7 w-7 data-[state=checked]:translate-x-6",
    },
  },
});

const switchShad = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof switchVariants>
>(({ className, size, thumbSize, ...props }, reference) => (
  <Root
    className={cn(
      switchVariants({ size }),
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={reference}
  >
    <Thumb
      className={cn(
        switchVariants({ thumbSize }),
        "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0"
      )}
    />
  </Root>
));
switchShad.displayName = Root.displayName;

export { switchShad as Switch };
