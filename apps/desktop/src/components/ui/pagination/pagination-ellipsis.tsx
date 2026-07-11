import React, { type ComponentProps } from "react";
import { MoreHorizontal } from "lucide-react";

import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";

function paginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  const { t } = useTranslation();

  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{t("table.morePages")}</span>
    </span>
  );
}
paginationEllipsis.displayName = "PaginationEllipsis";

export { paginationEllipsis as PaginationEllipsis };
