/* eslint-disable max-len */
import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

import type { StepSharedProps } from "./stepper-types";
import { useStepper } from "./stepper";
import { StepLabel } from "./step-label";
import { StepIcon } from "./step-icon";
import { StepButtonContainer } from "./step-button-container";

// eslint-disable-next-line complexity
const horizontalStep = forwardRef<HTMLDivElement, StepSharedProps>((props, reference) => {
  const {
    isError,
    isLoading,
    onClickStep,
    variant,
    clickable,
    checkIcon: checkIconContext,
    errorIcon: errorIconContext,
    styles,
    steps,
    setStep,
  } = useStepper();

  const {
    index,
    isCompletedStep,
    isCurrentStep,
    hasVisited,
    icon,
    label,
    description,
    isKeepError,
    state,
    checkIcon: checkIconProperty,
    errorIcon: errorIconProperty,
  } = props;

  const localIsLoading = isLoading ?? state === "loading";
  const localIsError = isError ?? state === "error";

  const opacity = hasVisited !== undefined && hasVisited ? 1 : 0.8;

  const active = variant === "line" ? (isCompletedStep ?? isCurrentStep) : isCompletedStep;

  const checkIcon = checkIconProperty ?? checkIconContext;
  const errorIcon = errorIconProperty ?? errorIconContext;

  return (
    <div
      aria-disabled={!(hasVisited !== undefined && hasVisited)}
      className={cn(
        "stepper__horizontal-step",
        "flex items-center relative transition-all duration-200",
        "[&:not(:last-child)]:flex-1",
        "[&:not(:last-child)]:after:transition-all [&:not(:last-child)]:after:duration-200",
        "[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:h-[2px] [&:not(:last-child)]:after:bg-[#F5F5F5]",
        "data-[completed=true]:[&:not(:last-child)]:after:bg-[#5CAFE7]",
        "data-[invalid=true]:[&:not(:last-child)]:after:bg-destructive",
        variant === "circle-alt" &&
          "justify-start flex-col flex-1 [&:not(:last-child)]:after:relative [&:not(:last-child)]:after:order-[-1] [&:not(:last-child)]:after:start-[50%] [&:not(:last-child)]:after:end-[50%] [&:not(:last-child)]:after:top-[calc(var(--step-icon-size)/2)] [&:not(:last-child)]:after:w-[calc((100%-var(--step-icon-size))-(var(--step-gap)))]",
        variant === "circle" &&
          "[&:not(:last-child)]:after:flex-1 [&:not(:last-child)]:after:ms-[var(--step-gap)] [&:not(:last-child)]:after:me-[var(--step-gap)]",
        variant === "line" && "flex-col flex-1 border-t-[3px] data-[active=true]:border-[#5CAFE7]",
        styles?.["horizontal-step"]
      )}
      data-active={active}
      data-clickable={clickable}
      data-completed={isCompletedStep}
      data-invalid={localIsError}
      data-optional={steps[index ?? 0]?.optional}
      onClick={() => onClickStep?.(index ?? 0, setStep)}
      ref={reference}
    >
      <div
        className={cn(
          "stepper__horizontal-step-container",
          "flex items-center",
          variant === "circle-alt" && "flex-col justify-center gap-1",
          variant === "line" && "w-full",
          styles?.["horizontal-step-container"]
        )}
      >
        <StepButtonContainer
          {...{
            ...props,
            isError: localIsError,
            isLoading: localIsLoading,
          }}
        >
          <StepIcon
            {...{
              index,
              isCompletedStep,
              isCurrentStep,
              isError: localIsError,
              isKeepError,
              isLoading: localIsLoading,
            }}
            checkIcon={checkIcon}
            errorIcon={errorIcon}
            icon={icon}
          />
        </StepButtonContainer>
        <StepLabel description={description} label={label} {...{ isCurrentStep, opacity }} />
      </div>
    </div>
  );
});
horizontalStep.displayName = "HorizontalStep";

export { horizontalStep as HorizontalStep };
