import React, { type ReactNode } from "react";

export function FormItemsContainer({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-full w-full pt-4 pb-4 px-10 space-y-2 justify-items-center">
      {children}
    </div>
  );
}
