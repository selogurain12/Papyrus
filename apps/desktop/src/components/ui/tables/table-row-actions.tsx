import type { Row } from "@tanstack/react-table";
import { RxDotsVertical } from "react-icons/rx";

import { DropdownMenu, DropdownMenuTrigger } from "../dropdown-menu/dropdown-menu";
import { Button } from "../button";
import { DropdownMenuContent } from "../dropdown-menu/dropdown-menu-content";
import { DropdownMenuItem } from "../dropdown-menu/dropdown-menu-item";
import { DropdownMenuSeparator } from "../dropdown-menu/dropdown-menu-separator";
import React from "react";

interface DataTableRowActionsProps<Tdata> {
  row: Row<Tdata>;
}

export function DataTableRowActions<Tdata>({ row }: DataTableRowActionsProps<Tdata>) {
  function handleDelete() {
    row.toggleSelected(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" variant="ghost">
          <RxDotsVertical className="h-4 w-4" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Modifier</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>Supprimer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
