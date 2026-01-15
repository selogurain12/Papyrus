import React, { createContext, forwardRef, useId, useMemo } from "react";

import { cn } from "../../../lib/utils";

interface FormItemContextValue {
  id: string;
}

 
const FormItemContext = createContext<FormItemContextValue>(
   
  {} as FormItemContextValue
);

const formItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, reference) => {
    const id = useId();

    const contextValue = useMemo(() => ({ id }), [id]);

    return (
      <FormItemContext.Provider value={contextValue}>
        <div className={cn("flex flex-col space-y-1", className)} ref={reference} {...props} />
      </FormItemContext.Provider>
    );
  }
);
formItem.displayName = "FormItem";

export { formItem as FormItem, FormItemContext };
