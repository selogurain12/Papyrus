import React, { forwardRef } from "react";

import { cn } from "../../../lib/utils";

interface CardDescriptionProps extends React.HTMLAttributes<HTMLHeadingElement> {
  description: string;
}

const cardDescription = forwardRef<HTMLHeadingElement, CardDescriptionProps>(
  ({ className, description, ...rest }: CardDescriptionProps, reference) => (
    <p className={cn("text-sm text-muted-foreground", className)} ref={reference} {...rest}>
      {description}
    </p>
  )
);

cardDescription.displayName = "CardDescription";

export { cardDescription as CardDescription };
