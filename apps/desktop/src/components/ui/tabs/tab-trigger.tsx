/* eslint-disable max-len */
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { Trigger } from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";

const triggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "px-3 py-1.5 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",

        button:
          "text-xs rounded-lg py-2 px-3 text-secondary-foreground data-[state=active]:text-foreground data-[state=active]:bg-white",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

interface TriggerProps
  extends ComponentPropsWithoutRef<typeof Trigger>, VariantProps<typeof triggerVariants> {}

const tabsTrigger = forwardRef<ComponentRef<typeof Trigger>, TriggerProps>(
  ({ className, variant, ...props }, reference) => (
    <Trigger className={cn(triggerVariants({ variant, className }))} ref={reference} {...props} />
  )
);
tabsTrigger.displayName = Trigger.displayName;
export { tabsTrigger as TabsTrigger };
