import { Provider, Root, type Toast, type ToastAction } from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import React, {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ComponentRef,
} from "react";

import { cn } from "../../../lib/utils";

const toastProvider = Provider;

const toastVariants = cva(
  // eslint-disable-next-line max-len
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",

        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",

        success: "border-green-600 bg-green-500 text-white",

        warning: "border-yellow-500 bg-yellow-400 text-black",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

const toast = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, reference) => (
  <Root className={cn(toastVariants({ variant }), className)} ref={reference} {...props} />
));
toast.displayName = Root.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = ReactElement<typeof ToastAction>;

export { type ToastProps, type ToastActionElement, toastProvider as ToastProvider, toast as Toast };
