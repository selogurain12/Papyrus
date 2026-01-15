import React, { type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

function AlertDialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
  );
}
AlertDialogHeader.displayName = "AlertDialogHeader";

export { AlertDialogHeader };
