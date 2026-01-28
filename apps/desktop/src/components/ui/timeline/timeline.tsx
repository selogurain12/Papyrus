import { Children, Fragment, type FC, type ReactNode } from "react";

import { cn } from "../../../lib/utils";

interface TimelineProps {
  children: ReactNode;
}

const timeline: FC<TimelineProps> = ({ children }) => {
  const timelineItems = Children.toArray(children);

  return (
    <div className={cn("flex flex-col items-start")}>
      {timelineItems.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <div className={cn("h-16 w-[3px] bg-gray-400 self-stretch ml-[4px]")} />}
          {child}
        </Fragment>
      ))}
    </div>
  );
};
timeline.displayName = "Timeline";

export { timeline as Timeline };
