import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";

const timelineDot = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { isLast?: boolean }
>(({ className, isLast = false, children, ...props }, reference) => (
  <div className="flex flex-col items-center">
    <div
      className={cn(
        // eslint-disable-next-line max-len
        "relative flex h-10 md:h-zoom-10 w-10 md:w-zoom-10 shrink-0 items-center justify-center rounded-full border border-border bg-background",
        className
      )}
      ref={reference}
      {...props}
    >
      {children}
    </div>
    {!isLast && <div className="border grow my-2 md:my-zoom-2 py-3 md:py-zoom-3" />}
  </div>
));

timelineDot.displayName = "TimelineDot";
export { timelineDot as TimelineDot };
