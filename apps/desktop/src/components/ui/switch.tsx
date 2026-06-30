/* eslint-disable max-len */
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-gray-300 bg-gray-300 shadow-sm transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 data-[size=sm]:h-4 data-[size=sm]:w-7 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=unchecked]:border-gray-300 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:border-secondary-600 dark:data-[state=unchecked]:bg-secondary-700 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 translate-x-0.5 rounded-full bg-white shadow ring-0 transition-transform group-data-[size=sm]/switch:size-3 group-data-[state=checked]/switch:translate-x-[18px] group-data-[state=unchecked]/switch:translate-x-0.5 group-data-[size=sm]/switch:group-data-[state=checked]/switch:translate-x-[14px] dark:group-data-[state=checked]/switch:bg-primary-foreground dark:group-data-[state=unchecked]/switch:bg-white"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
