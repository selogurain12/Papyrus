import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

const timeline = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, reference) => (
    <div
      className={cn("flex flex-col gap-y-0 md:gap-y-zoom-0", className)}
      ref={reference}
      {...props}
    />
  )
);
timeline.displayName = "Timeline";

export { timeline as Timeline };
