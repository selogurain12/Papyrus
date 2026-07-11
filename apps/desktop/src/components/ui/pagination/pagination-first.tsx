import { ChevronFirst } from "lucide-react";

import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";

import { PaginationLink, type PaginationLinkProps } from "./pagination-link";

function paginationFirst({ className, disabled, ...props }: PaginationLinkProps) {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("table.firstPage")}
      className={cn("gap-1 pl-2.5", className)}
      disabled={disabled}
      size="default"
      {...props}
    >
      <ChevronFirst className="h-4 w-4" />
      <span>{t("table.first")}</span>
    </PaginationLink>
  );
}
paginationFirst.displayName = "PaginationFirst";

export { paginationFirst as PaginationFirst };
