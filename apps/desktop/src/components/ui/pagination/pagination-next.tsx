import { ChevronRight } from "lucide-react";

import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";

import { PaginationLink, type PaginationLinkProps } from "./pagination-link";

function paginationNext({ className, disabled, ...props }: PaginationLinkProps) {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("table.nextPage")}
      className={cn("gap-1 pr-2.5", className)}
      disabled={disabled}
      size="default"
      {...props}
    >
      <span>{t("next")}</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}
paginationNext.displayName = "PaginationNext";

export { paginationNext as PaginationNext };
