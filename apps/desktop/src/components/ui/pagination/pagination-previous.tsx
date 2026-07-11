import { ChevronLeft } from "lucide-react";

import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";

import { PaginationLink, type PaginationLinkProps } from "./pagination-link";

function paginationPrevious({ className, disabled, ...props }: PaginationLinkProps) {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("table.previousPage")}
      className={cn("gap-1 pl-2.5", className)}
      disabled={disabled}
      size="default"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>{t("previous")}</span>
    </PaginationLink>
  );
}
paginationPrevious.displayName = "PaginationPrevious";

export { paginationPrevious as PaginationPrevious };
