import React, { useState } from "react";

import { cn } from "../../lib/utils";

import { Button } from "./button";

interface SplitButtonUnit {
  title: string;
  value: string;
  action?: () => void;
}
interface SplitButtonInterface {
  className?: string;
  buttons: SplitButtonUnit[];
  defaultButton?: number;
  // eslint-disable-next-line no-unused-vars
  action?: (value: string) => void;
  disabled?: boolean;
}
export function SplitButton({
  className = undefined,
  buttons,
  defaultButton = 0,
  action = undefined,
  disabled = false,
}: SplitButtonInterface) {
  const [active, setActive] = useState(defaultButton);
  return (
    <div className={cn("flex items-center", className)}>
      {buttons.map((button, index) => (
        <Button
          className={cn(
            index === 0 ? "rounded-r-none" : "rounded-l-none border-l-0",
            index !== 0 && index < buttons.length - 1 && "rounded-r-none",
            index === active &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            "flex-1"
          )}
          disabled={disabled}
          key={button.value}
          onClick={(event) => {
            event.preventDefault();
            setActive(index);
            if (button.action !== undefined) {
              button.action();
            }
            if (action !== undefined) {
              action(button.value);
            }
          }}
          variant="outline"
        >
          {button.title}
        </Button>
      ))}
    </div>
  );
}

export type { SplitButtonUnit };
