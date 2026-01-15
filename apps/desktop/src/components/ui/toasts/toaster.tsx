import React from "react";
import { Toast, ToastProvider } from "./toast";
import { ToastClose } from "./toast-close";
import { ToastDescription } from "./toast-description";
import { ToastTitle } from "./toast-title";
import { ToastViewport } from "./toast-viewport";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title !== undefined && <ToastTitle>{title}</ToastTitle>}
            {description !== undefined && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
