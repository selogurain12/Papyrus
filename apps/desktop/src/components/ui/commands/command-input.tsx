import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { LuSearch } from "react-icons/lu";
import { CommandInput } from "cmdk";

import { cn } from "../../../lib/utils";

const commandInput = forwardRef<
  ComponentRef<typeof CommandInput>,
  ComponentPropsWithoutRef<typeof CommandInput>
>(({ className, ...props }, reference) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <LuSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandInput
      className={cn(
        // eslint-disable-next-line max-len
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={reference}
      {...props}
    />
  </div>
));

commandInput.displayName = CommandInput.displayName;

export { commandInput as CommandInput };
