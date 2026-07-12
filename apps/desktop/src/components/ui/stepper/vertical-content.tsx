import React, { Children, cloneElement, isValidElement, type ReactNode } from "react";

import { useStepper } from "./stepper";

interface StepElementProps {
  index?: number;
  isCompletedStep?: boolean;
  isCurrentStep?: boolean;
  isLastStep?: boolean;
}

export function VerticalContent({ children }: { children: ReactNode }) {
  const { activeStep } = useStepper();

  const childArray = Children.toArray(children);
  const stepCount = childArray.length;

  return (
    <>
      {Children.map(children, (child, index) => {
        const isCompletedStep: boolean =
          isValidElement<StepElementProps>(child) && child.props.isCompletedStep === true
            ? true
            : index < activeStep;
        const isLastStep = index === stepCount - 1;
        const isCurrentStep = index === activeStep;

        const stepProps = {
          index,
          isCompletedStep,
          isCurrentStep,
          isLastStep,
        };

        if (isValidElement<StepElementProps>(child)) {
          return cloneElement(child, stepProps);
        }
        return null;
      })}
    </>
  );
}
