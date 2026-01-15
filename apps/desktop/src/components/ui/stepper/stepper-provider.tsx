import React, { useState } from "react";

import { StepperContext, type StepperContextValue } from "./stepper-context";

interface StepperContextProviderProps {
  value: Omit<StepperContextValue, "activeStep">;
  children: React.ReactNode;
}

export function StepperProvider({ value, children }: StepperContextProviderProps) {
  const isError = value.state === "error";
  const isLoading = value.state === "loading";

  const [activeStep, setActiveStep] = useState(value.initialStep);

  function nextStep() {
    setActiveStep((previous) => previous + 1);
  }

  function previousStep() {
    setActiveStep((previous) => previous - 1);
  }

  function resetSteps() {
    setActiveStep(value.initialStep);
  }

  function setStep(step: number) {
    setActiveStep(step);
  }

  return (
    <StepperContext.Provider
      value={{
        ...value,
        isError,
        isLoading,
        activeStep,
        nextStep,
        prevStep: previousStep,
        resetSteps,
        setStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
}
