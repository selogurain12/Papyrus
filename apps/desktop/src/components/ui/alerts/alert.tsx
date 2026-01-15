/* eslint-disable max-len */
import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",

        destructive:
          "bg-destructive-foreground border-destructive text-destructive dark:border-destructive [&>svg]:text-destructive",

        info: "bg-info-foreground border-info text-info dark:border-info [&>svg]:text-info",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

const alert = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, reference) => (
  <div
    className={cn(alertVariants({ variant }), className)}
    ref={reference}
    role="alert"
    {...props}
  />
));
alert.displayName = "Alert";

export { alert as Alert };
