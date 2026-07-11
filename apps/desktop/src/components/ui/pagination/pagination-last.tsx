import { ChevronLast } from "lucide-react";

import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";

import { PaginationLink, type PaginationLinkProps } from "./pagination-link";

function paginationLast({ className, disabled, ...props }: PaginationLinkProps) {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("table.lastPage")}
      className={cn("gap-1 pr-2.5", className)}
      disabled={disabled}
      size="default"
      {...props}
    >
      <span>{t("table.last")}</span>
      <ChevronLast className="h-4 w-4" />
    </PaginationLink>
  );
}
paginationLast.displayName = "PaginationLast";

export { paginationLast as PaginationLast };
