import { cva } from "class-variance-authority";
import React, { forwardRef, useMemo } from "react";
import { CheckIcon, Loader2, X } from "lucide-react";

import { cn } from "../../../lib/utils";

import type { StepIconProps } from "./stepper-types";
import { useStepper } from "./stepper";

const iconVariants = cva("", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-4",
      lg: "size-5",
    },
  },

  defaultVariants: {
    size: "md",
  },
});

const stepIcon = forwardRef<HTMLDivElement, StepIconProps>((props, reference) => {
  const { size } = useStepper();

  const {
    isCompletedStep,
    isCurrentStep,
    isError,
    isLoading,
    isKeepError,
    icon: CustomIcon,
    index,
    checkIcon: CustomCheckIcon,
    errorIcon: CustomErrorIcon,
  } = props;

  const Icon = useMemo(() => CustomIcon ?? null, [CustomIcon]);

  const ErrorIcon = useMemo(() => CustomErrorIcon ?? null, [CustomErrorIcon]);

  const Check = useMemo(() => CustomCheckIcon ?? CheckIcon, [CustomCheckIcon]);

  // eslint-disable-next-line complexity
  return useMemo(() => {
    if (isCompletedStep !== undefined && isCompletedStep) {
      if (isError !== undefined && isError && isKeepError !== undefined && isKeepError) {
        return (
          <div key="icon">
            <X className={cn(iconVariants({ size }))} />
          </div>
        );
      }
      return (
        <div key="check-icon">
          <Check className={cn(iconVariants({ size }))} />
        </div>
      );
    }
    if (isCurrentStep !== undefined && isCurrentStep) {
      if (isError !== undefined && isError && ErrorIcon) {
        return (
          <div key="error-icon">
            <ErrorIcon className={cn(iconVariants({ size }))} />
          </div>
        );
      }
      if (isError !== undefined && isError) {
        return (
          <div key="icon">
            <X className={cn(iconVariants({ size }))} />
          </div>
        );
      }
      if (isLoading !== undefined && isLoading) {
        return <Loader2 className={cn(iconVariants({ size }), "animate-spin")} />;
      }
    }
    if (Icon) {
      return (
        <div key="step-icon">
          <Icon className={cn(iconVariants({ size }))} />
        </div>
      );
    }
    return (
      <span className={cn("font-medium text-center text-md")} key="label" ref={reference}>
        {(index ?? 0) + 1}
      </span>
    );
  }, [
    isCompletedStep,
    isCurrentStep,
    isError,
    isLoading,
    Icon,
    index,
    Check,
    ErrorIcon,
    isKeepError,
    reference,
    size,
  ]);
});
stepIcon.displayName = "StepIcon";

export { stepIcon as StepIcon };
