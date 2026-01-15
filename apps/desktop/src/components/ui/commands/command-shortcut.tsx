import React, { type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

function commandShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}
commandShortcut.displayName = "CommandShortcut";

export { commandShortcut as CommandShortcut };
