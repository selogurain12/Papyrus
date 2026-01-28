import React, { type FC, type ReactNode } from "react";

import { cn } from "../../../lib/utils";

import { TimelineDot } from "./timeline-dot";
import { TimelineContent } from "./timeline-content";

interface TimelineItemProps {
  children: ReactNode;
  className?: string;
}

const timelineItem: FC<TimelineItemProps> = ({ children, className }) => (
  <div className={cn("flex items-center", className)}>
    <TimelineDot />
    <TimelineContent>{children}</TimelineContent>
  </div>
);
timelineItem.displayName = "TimelineItem";

export { timelineItem as TimelineItem };
