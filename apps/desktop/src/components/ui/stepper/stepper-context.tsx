/* eslint-disable no-empty-function */
 
import { createContext } from "react";

import type { StepperProps } from "./stepper-types";

interface StepperContextValue extends StepperProps {
  clickable?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  isVertical?: boolean;
  stepCount?: number;
  expandVerticalSteps?: boolean;
  activeStep: number;
  initialStep: number;
}

const stepperContext = createContext<
  StepperContextValue & {
    nextStep: () => void;
    prevStep: () => void;
    resetSteps: () => void;
    // eslint-disable-next-line no-unused-vars
    setStep: (step: number) => void;
  }
>({
  steps: [],
  activeStep: 0,
  initialStep: 0,
  nextStep: () => {},
  prevStep: () => {},
  resetSteps: () => {},
  setStep: () => {},
});

export { stepperContext as StepperContext };
export type { StepperContextValue };
