import { Title } from "@radix-ui/react-dialog";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../../lib/utils";

const dialogTitle = forwardRef<ComponentRef<typeof Title>, ComponentPropsWithoutRef<typeof Title>>(
  ({ className, ...props }, reference) => (
    <Title
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      ref={reference}
      {...props}
    />
  )
);
dialogTitle.displayName = Title.displayName;

export { dialogTitle as DialogTitle };
