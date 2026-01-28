/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
  type ColumnFiltersState,
  type SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type PaginationState,
  type Updater,
  type Cell,
} from "@tanstack/react-table";
import React, { useState, type HTMLAttributes } from "react";

import { cn } from "../../../lib/utils";
import { Spinner } from "../spinner";

import { Table } from "./table";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";
import { TableBody } from "./table-body";
import { TableCell } from "./table-cell";
import { DataTablePagination } from "./table-pagination";
import { TableHead } from "./table-head";
import type { DataTableToolbarProps } from "./table-toolbar-props";

type Toolbar<Tdata> = React.ComponentType<DataTableToolbarProps<Tdata>>;

interface TableProps<Tdata, Value> extends HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<Tdata, Value>[];
  data?: Tdata[];
  isLoading?: boolean;
  total: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  setPage: (page: number) => void;
  setSearch: (search?: string) => void;

  ToolbarComponent: Toolbar<Tdata>;
  defaultItemsPerPage?: number;
  onCellClick?: (cell: Cell<Tdata, unknown>) => void;
  toolbarProps?: { [key: string]: unknown };
}

export function DataTable<Tdata extends { [key: string]: unknown }, Value>({
  className,
  columns,

  data = [] as Tdata[],
  total,
  isLoading = false,
  defaultItemsPerPage = 10,
  setItemsPerPage,
  setPage,
  setSearch,
  onCellClick = undefined,
  toolbarProps = undefined,

  ToolbarComponent,
}: TableProps<Tdata, Value>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(defaultItemsPerPage);
  const [pageIndex, setPageIndex] = useState(0);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),

    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,

      pagination: {
        pageSize,
        pageIndex,
      },
    },

    defaultColumn: {
      size: 150,
      minSize: 100,
    },

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,

    manualFiltering: true,

    onPaginationChange: (updater: Updater<PaginationState>) => {
      if (typeof updater === "function") {
        setPageSize((previousPageSize) => {
          const temporaryPreviousState: PaginationState = {
            pageSize: previousPageSize,
            pageIndex: 0,
          };

          const newState = updater(temporaryPreviousState);

          return newState.pageSize;
        });

        setPageIndex((previousPageIndex) => {
          const temporaryPreviousState: PaginationState = {
            pageSize,
            pageIndex: previousPageIndex,
          };

          const newState = updater(temporaryPreviousState);

          return newState.pageIndex;
        });
      } else {
        setPageSize(updater.pageSize);
        setPageIndex(updater.pageIndex);
      }
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
  });

  return (
    <div className={cn("space-y-6 flex flex-col", className)}>
      <ToolbarComponent setSearch={setSearch} table={table} {...toolbarProps} />
      <div className="flex-grow flex-shrink rounded-2xl">
        <Table className="bg-white rounded-2xl">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-white" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className="h-24 md:h-zoom-24 text-center" colSpan={columns.length}>
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={cn(onCellClick !== undefined && "hover:cursor-pointer")}
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        onCellClick?.(cell);
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  Aucun résultat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        setItemsPerPage={(newPageSize) => {
          setPageSize(newPageSize);
          setItemsPerPage(newPageSize);
        }}
        setPage={(newPageIndex) => {
          setPageIndex(newPageIndex);
          setPage(newPageIndex + 1);
        }}
        table={table}
      />
    </div>
  );
}
