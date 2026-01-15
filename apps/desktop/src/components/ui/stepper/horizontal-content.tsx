import React, { Children, isValidElement, type ReactNode } from "react";

import { useStepper } from "./stepper";

export function HorizontalContent({ children }: { children: ReactNode }) {
  const { activeStep } = useStepper();
  const childArray = Children.toArray(children);

  if (activeStep > childArray.length) {
    return null;
  }

  return (
    <>
      {Children.map(childArray[activeStep], (node) => {
        if (!isValidElement(node)) {
          return null;
        }
        return Children.map(node.props.children, (childNode) => childNode);
      })}
    </>
  );
}
