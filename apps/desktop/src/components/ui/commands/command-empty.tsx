import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { CommandEmpty } from "cmdk";

const commandEmpty = forwardRef<
  ComponentRef<typeof CommandEmpty>,
  ComponentPropsWithoutRef<typeof CommandEmpty>
>((props, reference) => (
  <CommandEmpty className="text-center text-sm" ref={reference} {...props} />
));

commandEmpty.displayName = CommandEmpty.displayName;
export { commandEmpty as CommandEmpty };
