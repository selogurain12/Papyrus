import { RxMixerHorizontal } from "react-icons/rx";
import type { Table } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuTrigger } from "../dropdown-menu/dropdown-menu";
import { Button } from "../button";
import { DropdownMenuContent } from "../dropdown-menu/dropdown-menu-content";
import { DropdownMenuLabel } from "../dropdown-menu/dropdown-menu-label";
import { DropdownMenuSeparator } from "../dropdown-menu/dropdown-menu-separator";
import { DropdownMenuCheckboxItem } from "../dropdown-menu/dropdown-menu-checkbox-item";
import React from "react";

interface TableViewOptionsProps<Tdata> {
  table: Table<Tdata>;
}

export function TableViewOptions<Tdata>({ table }: TableViewOptionsProps<Tdata>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Toggle columns"
          className="hidden h-8 lg:flex focus-visible:ring-0 focus-visible:ring-offset-0"
          size="sm"
          variant="outline"
        >
          <RxMixerHorizontal className="mr-2 size-4" />
          Vues
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Affichage des colonnes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.accessorFn !== undefined && column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              checked={column.getIsVisible()}
              key={column.id}
              onSelect={(event) => {
                column.toggleVisibility(!column.getIsVisible());
                event.preventDefault();
              }}
            >
              <span className="truncate">{column.columnDef.meta?.toString() ?? "Non défini"}</span>
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
