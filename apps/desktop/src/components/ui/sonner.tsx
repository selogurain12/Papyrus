/* eslint-disable max-len */
import React, { type ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      closeButton
      theme="light"
      toastOptions={{
        classNames: {
          warning:
            "group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-warning-foreground",

          info: "group-[.toaster]:bg-info group-[.toaster]:text-info-foreground group-[.toaster]:border-info-foreground",

          error:
            "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive-foreground",

          success:
            "group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-success-foreground",

          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",

          description: "group-[.toast]:text-muted-foreground",

          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",

          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",

          closeButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
