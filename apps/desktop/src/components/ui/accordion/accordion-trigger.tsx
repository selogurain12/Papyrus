import { Header, Trigger } from "@radix-ui/react-accordion";
import React, {
  forwardRef,
  type ComponentRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../button";

interface AccordionTriggerProps extends ComponentPropsWithoutRef<typeof Trigger> {
  headerClassName?: string;
  isOpenIconLeading?: boolean;
  deleteIcon?: ReactNode;
}

const accordionTrigger = forwardRef<ComponentRef<typeof Trigger>, AccordionTriggerProps>(
  (
    { className, headerClassName, isOpenIconLeading, children, deleteIcon, ...props },
    reference
  ) => (
    <Header className={cn("flex items-center", headerClassName)}>
      <Trigger
        className={cn(
          // eslint-disable-next-line max-len
          "flex flex-1 items-center justify-between py-4 gap-2 font-medium transition-all [&[data-state=open]>#triggerIcon]:rotate-180 hover:underline",
          className
        )}
        ref={reference}
        {...props}
      >
        {isOpenIconLeading !== undefined && isOpenIconLeading && (
          <ChevronDown
            className="h-4 w-4 shrink-0 transition-transform duration-200"
            id="triggerIcon"
          />
        )}
        {children}
        {(isOpenIconLeading === undefined || !isOpenIconLeading) && (
          <ChevronDown
            className="h-4 w-4 shrink-0 transition-transform duration-200"
            id="triggerIcon"
          />
        )}
      </Trigger>
      {deleteIcon !== undefined && (
        <Button className="p-4 justify-center items-center [&:hover>svg]:scale-125" variant="ghost">
          {deleteIcon}
        </Button>
      )}
    </Header>
  )
);
accordionTrigger.displayName = Trigger.displayName;

export { accordionTrigger as AccordionTrigger };
