import React, { type ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";
import { buttonVariants, Button } from "../button";

interface PaginationLinkProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isActive?: boolean;
  disabled?: boolean;
}

function paginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      className={cn(
        buttonVariants({
          variant: isActive !== undefined && isActive ? "outline" : "ghost",

          size,
        }),
        className,
        "bg-background text-foreground hover:text-primary-foreground"
      )}
      disabled={disabled}
      {...props}
    />
  );
}
paginationLink.displayName = "PaginationLink";

export type { PaginationLinkProps };
export { paginationLink as PaginationLink };
