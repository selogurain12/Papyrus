import { cva } from "class-variance-authority";
import React, { type ReactNode } from "react";

import { cn } from "../../../lib/utils";

import { useStepper } from "./stepper";

interface StepLabelProps {
  isCurrentStep?: boolean;
  opacity: number;
  label?: ReactNode | string;
  description?: string | null;
}

const labelVariants = cva("", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
    },
  },

  defaultVariants: {
    size: "md",
  },
});

const descriptionVariants = cva("", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-xs",
      lg: "text-sm",
    },
  },

  defaultVariants: {
    size: "md",
  },
});

// eslint-disable-next-line complexity
function StepLabel({
  isCurrentStep = undefined,
  opacity,
  label = undefined,
  description = undefined,
}: StepLabelProps) {
  const { variant, styles, size, orientation } = useStepper();
  const shouldRender = Boolean(label) || Boolean(description);

  return shouldRender ? (
    <div
      aria-current={isCurrentStep !== undefined && isCurrentStep ? "step" : undefined}
      className={cn(
        "stepper__step-label-container",
        "flex-col flex",
        variant === "line" ? orientation === "horizontal" && "my-2" : "ms-2",
        variant === "circle-alt" && "text-center",
        variant === "circle-alt" && orientation === "horizontal" && "ms-0",
        variant === "circle-alt" && orientation === "vertical" && "text-start",
        styles?.["step-label-container"]
      )}
      style={{
        opacity,
      }}
    >
      {Boolean(label) && (
        <span
          className={cn("stepper__step-label", labelVariants({ size }), styles?.["step-label"])}
        >
          {label}
        </span>
      )}
      {Boolean(description) && (
        <span
          className={cn(
            "stepper__step-description",
            "text-muted-foreground",
            descriptionVariants({ size }),
            styles?.["step-description"]
          )}
        >
          {description}
        </span>
      )}
    </div>
  ) : null;
}

export { StepLabel };
