/* eslint-disable no-unused-vars */
import { RxArrowDown, RxArrowUp, RxCaretSort, RxEyeNone } from "react-icons/rx";
import type { Column } from "@tanstack/react-table";

import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { DropdownMenu, DropdownMenuTrigger } from "../dropdown-menu/dropdown-menu";
import { DropdownMenuContent } from "../dropdown-menu/dropdown-menu-content";
import { DropdownMenuItem } from "../dropdown-menu/dropdown-menu-item";
import { DropdownMenuSeparator } from "../dropdown-menu/dropdown-menu-separator";
import React from "react";

interface DataTableColumnHeaderProps<Tdata, Tvalue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<Tdata, Tvalue>;
  title: string;
  enableHide?: boolean;
  onSortChange?: (id: string, direction: "asc" | "desc") => void;
}

export function DataTableColumnHeader<Tdata, Tvalue>({
  column,
  title,
  className,
  enableHide = true,
  onSortChange,
}: DataTableColumnHeaderProps<Tdata, Tvalue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  function renderSortIcon() {
    switch (column.getIsSorted()) {
      case "desc": {
        return <RxArrowDown className="ml-2 h-4 w-4" />;
      }
      case "asc": {
        return <RxArrowUp className="ml-2 h-4 w-4" />;
      }
      default: {
        return <RxCaretSort className="ml-2 h-4 w-4" />;
      }
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="-ml-3 h-8 data-[state=open]:bg-accent" size="sm" variant="ghost">
            <span>{title}</span>
            {renderSortIcon()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              if (onSortChange) {
                onSortChange(column.id, "asc");
              }
              column.toggleSorting(false);
            }}
          >
            <RxArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (onSortChange) {
                onSortChange(column.id, "desc");
              }
              column.toggleSorting(true);
            }}
          >
            <RxArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>

          {enableHide && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  column.toggleVisibility(false);
                }}
              >
                <RxEyeNone className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
