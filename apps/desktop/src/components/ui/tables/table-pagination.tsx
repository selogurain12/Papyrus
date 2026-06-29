/* eslint-disable no-unused-vars */
import {
  RxChevronLeft,
  RxChevronRight,
  RxDoubleArrowLeft,
  RxDoubleArrowRight,
} from "react-icons/rx";
import type { Table } from "@tanstack/react-table";

import { Button } from "../button";
import { Select, SelectValue } from "../selects/select";
import { SelectTrigger } from "../selects/select-trigger";
import { SelectContent } from "../selects/select-content";
import { SelectItem } from "../selects/select-item";
import React from "react";
import { useTranslation } from "react-i18next";

interface DataTablePaginationProps<Tdata> {
  table: Table<Tdata>;
  setItemsPerPage: (itemsPerPage: number) => void;
  setPage: (page: number) => void;
}

export function DataTablePagination<Tdata>({
  table,
  setItemsPerPage,
  setPage,
}: DataTablePaginationProps<Tdata>) {
  const { t } = useTranslation();

  function handlePageSizeChange(value: number | string) {
    const newPageSize = Number(value);
    table.setPageSize(newPageSize);
    setItemsPerPage(newPageSize);
  }

  function goToPage(pageIndex: number) {
    table.setPageIndex(pageIndex);
    setPage(pageIndex);
  }

  function previousPage() {
    const previousPage = table.getState().pagination.pageIndex - 1;
    goToPage(previousPage);
  }

  function nextPage() {
    const nextPage = table.getState().pagination.pageIndex + 1;
    goToPage(nextPage);
  }

  return (
    <div className="flex items-center justify-start">
      {table.getIsSomeRowsSelected() && (
        <div className="flex-1 text-sm text-muted-foreground">
          {t("table.selectedRows", {
            selected: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>
      )}
      <div className="flex ml-auto items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t("table.rowsPerPage")}</p>
          <Select
            onValueChange={handlePageSizeChange}
            value={String(table.getState().pagination.pageSize)}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t("table.page", {
            page: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              goToPage(0);
            }}
            variant="outline"
          >
            <span className="sr-only">{t("table.firstPage")}</span>
            <RxDoubleArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            disabled={!table.getCanPreviousPage()}
            onClick={previousPage}
            variant="outline"
          >
            <span className="sr-only">{t("table.previousPage")}</span>
            <RxChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            disabled={!table.getCanNextPage()}
            onClick={nextPage}
            variant="outline"
          >
            <span className="sr-only">{t("table.nextPage")}</span>
            <RxChevronRight className="h-4 w-4" />
          </Button>
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              goToPage(table.getPageCount() - 1);
            }}
            variant="outline"
          >
            <span className="sr-only">{t("table.lastPage")}</span>
            <RxDoubleArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
