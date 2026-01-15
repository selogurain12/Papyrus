import React from "react";
import { cn } from "../../../lib/utils";

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  );
}
DialogFooter.displayName = "DialogFooter";

export { DialogFooter };
