/* eslint-disable max-len */
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "motion/react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        blue: "bg-blue-600 text-white hover:bg-blue-700/90",

        green: "bg-success-600 text-white hover:bg-success-700/90",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:test-destructive-foreground/80",

        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

        outlineButton: "border border-primary bg-background hover:bg-primary hover:text-foreground",

        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        white: "bg-white text-foreground hover:bg-muted",

        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        transparent: "bg-transparent text-foreground hover:bg-transparent",

        third: "bg-transparent text-foreground hover:bg-transparent border",

        noHover: "bg-transparent text-foreground hover:bg-transparent",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-md px-8",
        icon: "min-h-10 h-10 min-w-10 w-10",
        circle: "h-10 w-10 rounded-full",
        square: "h-6 w-6",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const buttonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, reference) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={reference}
        {...props}
      />
    );
  }
);
buttonComponent.displayName = "Button";

const motionButton = motion.create(buttonComponent);

export type { ButtonProps };
export { buttonComponent as Button, motionButton as MotionButton, buttonVariants };
