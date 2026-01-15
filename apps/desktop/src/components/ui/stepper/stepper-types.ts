 
import type { LucideIcon } from "lucide-react";

import type { StepProps } from "./step";

export type IconType = LucideIcon | React.ComponentType<unknown> | undefined;

export interface StepOptions {
  orientation?: "horizontal" | "vertical";
  state?: "error" | "loading";
  responsive?: boolean;
  checkIcon?: IconType;
  errorIcon?: IconType;
  // eslint-disable-next-line no-unused-vars
  onClickStep?: (step: number, setStep: (step: number) => void) => void;
  mobileBreakpoint?: string;
  variant?: "circle-alt" | "circle" | "line";
  expandVerticalSteps?: boolean;
  size?: "lg" | "md" | "sm";
  styles?: {
    "main-container"?: string;

    "horizontal-step"?: string;

    "horizontal-step-container"?: string;

    "vertical-step"?: string;

    "vertical-step-container"?: string;

    "vertical-step-content"?: string;

    "step-button-container"?: string;

    "step-label-container"?: string;

    "step-label"?: string;

    "step-description"?: string;
  };
  variables?: {
    "--step-icon-size"?: string;
    "--step-gap"?: string;
  };
  scrollTracking?: boolean;
}

export interface StepItem {
  id?: string;
  label?: string;
  description?: string;
  icon?: IconType;
  optional?: boolean;
}

export interface StepperProps extends StepOptions {
  children?: React.ReactNode;
  className?: string;
  initialStep: number;
  steps: StepItem[];
}

export interface StepSharedProps extends StepProps {
  isLastStep?: boolean;
  isCurrentStep?: boolean;
  index?: number;
  hasVisited: boolean | undefined;
  isError?: boolean;
  isLoading?: boolean;
}

export interface StepIconProps {
  isCompletedStep?: boolean;
  isCurrentStep?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  isKeepError?: boolean;
  icon?: IconType;
  index?: number;
  checkIcon?: IconType;
  errorIcon?: IconType;
}
