import type { Table } from "@tanstack/react-table";

export interface DataTableToolbarProps<Tdata> {
  table: Table<Tdata>;
  // eslint-disable-next-line no-unused-vars
  setSearch: (search?: string) => void;
}
