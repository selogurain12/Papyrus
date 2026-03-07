/* eslint-disable no-unused-vars */
import { useCallback, useState } from "react";

type OrderDirection = "asc" | "desc";

interface NestedOrderBy {
  [key: string]: NestedOrderBy | OrderDirection;
}

class FilterDto {
  public search?: string;

  public disablePagination?: boolean;

  public page?: number;

  public itemsPerPage?: number;

  public orderBy?: { [key: string]: NestedOrderBy | OrderDirection };
}

type FilterDtoSetter = {
  [Data in keyof FilterDto as `set${Capitalize<Data>}`]-?: (
    name: Required<FilterDto>[Data] | undefined
  ) => void;
};

export interface UseFilterDtoType<
  FilterDtoType extends FilterDto = FilterDto,
> extends FilterDtoSetter {
  options: FilterDtoType;
  reset: () => void;
}

export function useFilterDto(filter?: FilterDto): UseFilterDtoType {
  const [options, setOptions] = useState(filter ?? new FilterDto());

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
    (orderBy: { [key: string]: NestedOrderBy | OrderDirection } | undefined) => {
      setOptions({ ...options, orderBy });
    },
    [options]
  );

  const reset = useCallback(() => {
    setOptions(new FilterDto());
  }, []);

  return {
    options,
    setSearch,
    setDisablePagination,
    setPage,
    setItemsPerPage,
    setOrderBy,
    reset,
  };
}
