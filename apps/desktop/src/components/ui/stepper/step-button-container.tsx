/* eslint-disable max-len */
import React, { type ReactNode } from "react";

import { Button } from "../button";
import { cn } from "../../../lib/utils";

import type { StepSharedProps } from "./stepper-types";
import { useStepper } from "./stepper";

interface StepButtonContainerProps extends StepSharedProps {
  children?: ReactNode;
}

// eslint-disable-next-line complexity
function StepButtonContainer({
  isCurrentStep,
  isCompletedStep,
  children = undefined,
  isError,
  isLoading: isLoadingProperty,
  onClickStep,
}: StepButtonContainerProps) {
  const { clickable, isLoading: isLoadingContext, variant, styles } = useStepper();

  const currentStepClickable = clickable ?? Boolean(onClickStep);

  const isLoading = isLoadingProperty ?? isLoadingContext;

  if (variant === "line") {
    return null;
  }

  return (
    <Button
      aria-current={isCurrentStep !== undefined && isCurrentStep ? "step" : undefined}
      className={cn(
        "stepper__step-button-container",
        "rounded-full p-0 pointer-events-none",
        "w-[var(--step-icon-size)] h-[var(--step-icon-size)]",
        "border-2 flex rounded-full justify-center items-center",
        "data-[clickable=true]:pointer-events-auto",
        "data-[active=true]:bg-[#5CAFE7] data-[active=true]:border-[#5CAFE7] data-[active=true]:text-[#5CAFE7]-foreground",
        "data-[current=true]:border-[#5CAFE7] data-[current=true]:bg-secondary",
        "data-[invalid=true]:bg-destructive data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive-foreground",
        styles?.["step-button-container"]
      )}
      data-active={isCompletedStep}
      data-clickable={currentStepClickable}
      data-current={isCurrentStep}
      data-invalid={isError !== undefined && isError && (isCurrentStep ?? isCompletedStep)}
      data-loading={isLoading !== undefined && isLoading && (isCurrentStep ?? isCompletedStep)}
      variant="ghost"
    >
      {children}
    </Button>
  );
}

export { StepButtonContainer };
