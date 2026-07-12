/* eslint-disable no-unused-vars */
import { FilterGoalDto } from "@papyrus/source";
import { useCallback, useState } from "react";

export type OrderDirection = "asc" | "desc";

export interface NestedOrderBy {
  [key: string]: NestedOrderBy | OrderDirection;
}

type FilterDtoSetter = {
  [Data in keyof FilterGoalDto as `set${Capitalize<Data>}`]-?: (
    name: Required<FilterGoalDto>[Data] | undefined
  ) => void;
};

export interface UseFilterGoalDtoType<FilterDtoType extends FilterGoalDto = FilterGoalDto>
  extends FilterDtoSetter {
  options: FilterDtoType;
  setOptions: (options: FilterDtoType) => void;
}

export function useFilterGoalDto(filter?: FilterGoalDto): UseFilterGoalDtoType {
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

  const setType = useCallback(
    (type: ("daily" | "weekly" | "monthly" | "project") | undefined) => {
      setOptions({ ...options, page: 1, type });
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
    setType,
  };
}
