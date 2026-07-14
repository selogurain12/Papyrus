import React, { type ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "../../../lib/utils";

function paginationNav({ className, ...props }: ComponentProps<"nav">) {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("pagination.label")}
      className={cn("mx-auto flex w-full justify-center", className)}
      role="navigation"
      {...props}
    />
  );
}
paginationNav.displayName = "PaginationNav";

export { paginationNav as PaginationNav };
