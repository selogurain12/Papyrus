import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

const timelineContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, reference) => (
    <div
      className={cn(
        "flex flex-col gap-1 md:gap-zoom-1 pb-6 md:pb-zoom-6 pl-4 md:pl-zoom-4",
        className
      )}
      ref={reference}
      {...props}
    />
  )
);
timelineContent.displayName = "TimelineContent";
export { timelineContent as TimelineContent };
