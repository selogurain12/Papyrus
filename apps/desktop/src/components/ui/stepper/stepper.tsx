import React, {
  Children,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useState,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "../../../lib/utils";

import { StepperContext } from "./stepper-context";
import { VerticalContent } from "./vertical-content";
import { HorizontalContent } from "./horizontal-content";
import { StepperProvider } from "./stepper-provider";
import { Step } from "./step";
import type { StepperProps } from "./stepper-types";

// <---------- HOOKS ---------->

function useStepper() {
  const context = useContext(StepperContext);

  if (context === undefined) {
    throw new Error("useStepper must be used within a StepperProvider");
  }

  const { ...rest } = context;

  const isLastStep = context.activeStep === context.steps.length - 1;
  const hasCompletedAllSteps = context.activeStep === context.steps.length;

  const currentStep = context.steps[context.activeStep];
  const isOptionalStep = Boolean(currentStep?.optional);

  const isDisabledStep = context.activeStep === 0;

  return {
    ...rest,
    isLastStep,
    hasCompletedAllSteps,
    isOptionalStep,
    isDisabledStep,
    currentStep,
  };
}

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => {
      result.removeEventListener("change", onChange);
    };
  }, [query]);

  return value;
}

// <---------- STEPS ---------->

const VARIABLE_SIZES = {
  sm: "36px",
  md: "40px",
  lg: "44px",
};

const stepper = forwardRef<HTMLDivElement, StepperProps>(
  // eslint-disable-next-line complexity
  (props, reference: Ref<HTMLDivElement>) => {
    const {
      className,
      children,
      orientation: orientationProperty,
      state,
      responsive,
      checkIcon,
      errorIcon,
      onClickStep,
      mobileBreakpoint,
      expandVerticalSteps = false,
      initialStep = 0,
      size,
      steps,
      variant,
      styles,
      variables,
      scrollTracking = false,
      ...rest
    } = props;

    const childArray = Children.toArray(children);

    const items = [] as ReactElement[];

    const footer = childArray.map((child) => {
      if (!isValidElement(child)) {
        throw new Error("Stepper children must be valid React elements.");
      }
      if (child.type === Step) {
        items.push(child);
        return null;
      }

      return child;
    });

    const stepCount = items.length;

    const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint ?? "768px"})`);

    const clickable = Boolean(onClickStep);

    const orientation =
      isMobile && responsive !== undefined && responsive ? "vertical" : orientationProperty;

    const isVertical = orientation === "vertical";

    return (
      <StepperProvider
        value={{
          initialStep,
          orientation,
          state,
          size,
          responsive,
          checkIcon,
          errorIcon,
          onClickStep,
          clickable,
          stepCount,
          isVertical,
          variant: variant ?? "circle",
          expandVerticalSteps,
          steps,
          scrollTracking,
          styles,
        }}
      >
        <div
          className={cn(
            "stepper__main-container",
            "flex w-full flex-wrap",
            stepCount === 1 ? "justify-end" : "justify-between",
            orientation === "vertical" ? "flex-col" : "flex-row",
            variant === "line" && orientation === "horizontal" && "gap-4",
            className,
            styles?.["main-container"]
          )}
          ref={reference}
          style={
            {
              "--step-icon-size":
                variables?.["--step-icon-size"] ?? String(VARIABLE_SIZES[size ?? "md"]),

              "--step-gap": variables?.["--step-gap"] ?? "8px",
            } as React.CSSProperties
          }
          {...rest}
        >
          <VerticalContent>{items}</VerticalContent>
        </div>
        {orientation === "horizontal" && <HorizontalContent>{items}</HorizontalContent>}
        {footer}
      </StepperProvider>
    );
  }
);
stepper.displayName = "Stepper";

export { stepper as Stepper, useStepper };
