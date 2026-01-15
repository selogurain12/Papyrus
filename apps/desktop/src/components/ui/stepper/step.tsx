/* eslint-disable complexity */
/* eslint-disable no-unused-vars */
import React, { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";

import { useStepper } from "./stepper";
import { HorizontalStep } from "./horizontal-step";
import { VerticalStep } from "./vertical-step";
import type { IconType } from "./stepper-types";

interface StepProps extends HTMLAttributes<HTMLLIElement> {
  label?: ReactNode | string;
  description?: string;
  icon?: IconType;
  state?: "error" | "loading";
  checkIcon?: IconType;
  errorIcon?: IconType;
  isCompletedStep?: boolean;
  isKeepError?: boolean;
  onClickStep?: (step: number, setStep: (step: number) => void) => void;
}

// Props which shouldn't be passed to to the Step component from the user
interface StepInternalConfig {
  index: number;
  isCompletedStep?: boolean;
  isCurrentStep?: boolean;
  isLastStep?: boolean;
}

interface FullStepProps extends StepProps, StepInternalConfig {}

const step = forwardRef<HTMLLIElement, FullStepProps>(
  (
    {
      children,
      description = undefined,
      icon = undefined,
      state = undefined,
      checkIcon = undefined,
      errorIcon = undefined,
      index = undefined,
      isCompletedStep = undefined,
      isCurrentStep = undefined,
      isLastStep = undefined,
      isKeepError = undefined,
      label = undefined,
      onClickStep = undefined,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reference: Ref<any>
  ) => {
    const { isVertical, isError, isLoading, clickable } = useStepper();

    const hasVisited = isCurrentStep ?? isCompletedStep;

    const sharedProps = {
      isLastStep,
      isCompletedStep,
      isCurrentStep,
      index,
      isError,
      isLoading,
      clickable,
      label,
      description,
      hasVisited,
      icon,
      isKeepError,
      checkIcon,
      state,
      errorIcon,
      onClickStep,
    };

    function renderStep() {
      if (isVertical !== undefined && isVertical) {
        return (
          <VerticalStep ref={reference} {...sharedProps}>
            {children}
          </VerticalStep>
        );
      }
      return <HorizontalStep ref={reference} {...sharedProps} />;
    }

    return renderStep();
  }
);
step.displayName = "Step";

export { step as Step };
export type { StepProps };
