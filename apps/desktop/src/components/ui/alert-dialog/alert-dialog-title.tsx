import { Title } from "@radix-ui/react-alert-dialog";
import React, { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";

import { cn } from "../../../lib/utils";

const alertDialogTitle = forwardRef<
  ComponentRef<typeof Title>,
  ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, reference) => (
  <Title className={cn("text-lg font-semibold", className)} ref={reference} {...props} />
));
alertDialogTitle.displayName = Title.displayName;

export { alertDialogTitle as AlertDialogTitle };
