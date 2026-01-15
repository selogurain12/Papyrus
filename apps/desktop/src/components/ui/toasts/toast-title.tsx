import { Title } from "@radix-ui/react-toast";
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

const toastTitle = forwardRef<
  React.ComponentRef<typeof Title>,
  React.ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, reference) => (
  <Title className={cn("text-sm font-semibold", className)} ref={reference} {...props} />
));
toastTitle.displayName = Title.displayName;

export { toastTitle as ToastTitle };
