/* eslint-disable no-unused-vars */
import { FilterCharacterDto } from "@papyrus/source";
import { useCallback, useState } from "react";

export type OrderDirection = "asc" | "desc";

export interface NestedOrderBy {
  [key: string]: NestedOrderBy | OrderDirection;
}

type FilterDtoSetter = {
  [Data in keyof FilterCharacterDto as `set${Capitalize<Data>}`]-?: (
    name: Required<FilterCharacterDto>[Data] | undefined
  ) => void;
};

export interface UseFilterCharacterDtoType<
  FilterDtoType extends FilterCharacterDto = FilterCharacterDto,
> extends FilterDtoSetter {
  options: FilterDtoType;
  setOptions: (options: FilterDtoType) => void;
}

export function useFilterCharacterDto(filter?: FilterCharacterDto): UseFilterCharacterDtoType {
  const [options, setOptions] = useState(filter ?? {});

  const setSearch = useCallback(
    (search: string | undefined) => {
      setOptions({ ...options, search });
    },
    [options]
  );

  const setDisablePagination = useCallback(
    (disablePagination: boolean | undefined) => {
      setOptions({ ...options, disablePagination });
    },
    [options]
  );

  const setPage = useCallback(
    (page: number | undefined) => {
      setOptions({ ...options, page });
    },
    [options]
  );

  const setItemsPerPage = useCallback(
    (itemsPerPage: number | undefined) => {
      setOptions({ ...options, itemsPerPage });
    },
    [options]
  );

  const setOrderBy = useCallback(
    (
      orderBy:
        | { [key: string]: NestedOrderBy | OrderDirection }[]
        | { [key: string]: NestedOrderBy | OrderDirection }
        | undefined
    ) => {
      setOptions({ ...options, orderBy });
    },
    [options]
  );

  const setRole = useCallback(
    (
      role: ("protagonist" | "antagonist" | "ally" | "mentor" | "secondary character")[] | undefined
    ) => {
      setOptions({ ...options, page: 1, role });
    },
    [options]
  );

  const setMinAge = useCallback(
    (minAge: number | undefined) => {
      setOptions({ ...options, page: 1, minAge });
    },
    [options]
  );

  const setMaxAge = useCallback(
    (maxAge: number | undefined) => {
      setOptions({ ...options, page: 1, maxAge });
    },
    [options]
  );

  const setObjects = useCallback(
    (objects: string[] | undefined) => {
      setOptions({ ...options, page: 1, objects });
    },
    [options]
  );

  const setEvents = useCallback(
    (events: string[] | undefined) => {
      setOptions({ ...options, page: 1, events });
    },
    [options]
  );

  return {
    options,
    setOptions,
    setSearch,
    setDisablePagination,
    setPage,
    setItemsPerPage,
    setOrderBy,
    setRole,
    setMinAge,
    setMaxAge,
    setObjects,
    setEvents,
  };
}
