import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

const timelineItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, reference) => (
    <div className={cn("flex", className)} ref={reference} {...props} />
  )
);

timelineItem.displayName = "TimelineItem";
export { timelineItem as TimelineItem };
