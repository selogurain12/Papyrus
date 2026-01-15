/* eslint-disable max-len */
import type { Column } from "@tanstack/react-table";
import React, { type ComponentType } from "react";
import { RxCheck, RxPlusCircled } from "react-icons/rx";

import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { Separator } from "../separator";
import { Badge } from "../badge";
import { Command } from "../commands/command";
import { CommandInput } from "../commands/command-input";
import { CommandList } from "../commands/command-list";
import { CommandEmpty } from "../commands/command-empty";
import { CommandGroup } from "../commands/command-group";
import { CommandItem } from "../commands/command-item";
import { CommandSeparator } from "../commands/command-separator";
import { cn } from "../../../lib/utils";

interface DataTableFacetedFilterProps<Tdata, Tvalue> {
  column?: Column<Tdata, Tvalue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function DataTableFacetedFilter<Tdata, Tvalue>({
  options,
  column = undefined,
  title = "",
}: DataTableFacetedFilterProps<Tdata, Tvalue>) {
  const facets = column?.getFacetedUniqueValues();

  const filterValue = column?.getFilterValue();
  const selectedValues = new Set(isStringArray(filterValue) ? filterValue : []);
  function findFacetValue(
    facets: Map<unknown, number> | undefined,
    uuid: string
  ): number | undefined {
    if (facets === undefined) {
      return undefined;
    }

    for (const [key] of facets.entries()) {
      if (key !== null && typeof key === "object" && "v4Id" in key && key.v4Id === uuid) {
        return facets.get(key);
      }
      if (typeof key === "string") {
        return facets.get(uuid);
      }
    }
    return undefined;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 border-dashed" size="sm" variant="outline">
          <RxPlusCircled className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator className="mx-2 h-4" orientation="vertical" />
              <Badge className="rounded-sm px-1 font-normal lg:hidden" variant="secondary">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge className="rounded-sm px-1 font-normal" variant="secondary">
                    {selectedValues.size} sélectionnés
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        className="rounded-sm px-1 font-normal"
                        key={option.value}
                        variant="secondary"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Rechercher ${title.toLowerCase()}`} />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(filterValues.length > 0 ? filterValues : undefined);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <RxCheck className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                    {facets !== undefined && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {findFacetValue(facets, option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center text-center"
                    onSelect={() => column?.setFilterValue(undefined)}
                  >
                    Effacer les filtres
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
