import React, { type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

function AlertDialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  );
}
AlertDialogFooter.displayName = "AlertDialogFooter";

export { AlertDialogFooter };
