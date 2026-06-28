/* eslint-disable no-unused-vars */
import { ExportParamsDto } from "@papyrus/source";
import { useCallback, useState } from "react";

export type OrderDirection = "asc" | "desc";

export interface NestedOrderBy {
  [key: string]: NestedOrderBy | OrderDirection;
}

type FilterDtoSetter = {
  [Data in keyof ExportParamsDto as `set${Capitalize<Data>}`]-?: (
    name: Required<ExportParamsDto>[Data] | undefined
  ) => void;
};

export interface UseFilterExportDtoType<FilterDtoType extends ExportParamsDto = ExportParamsDto>
  extends FilterDtoSetter {
  options: FilterDtoType;
  setOptions: (options: FilterDtoType) => void;
}

export function useFilterExportDto(filter?: ExportParamsDto): UseFilterExportDtoType {
  const [options, setOptions] = useState(filter ?? {});

  const setCharacters = useCallback(
    (characters: boolean | undefined) => {
      setOptions({ ...options, characters });
    },
    [options]
  );

  const setPlaces = useCallback(
    (places: boolean | undefined) => {
      setOptions({ ...options, places });
    },
    [options]
  );

  const setObjects = useCallback(
    (objects: boolean | undefined) => {
      setOptions({ ...options, objects });
    },
    [options]
  );

  const setEvents = useCallback(
    (events: boolean | undefined) => {
      setOptions({ ...options, events });
    },
    [options]
  );

  const setNotes = useCallback(
    (notes: boolean | undefined) => {
      setOptions({ ...options, notes });
    },
    [options]
  );

  const setResearchs = useCallback(
    (researchs: boolean | undefined) => {
      setOptions({ ...options, researchs });
    },
    [options]
  );

  return {
    options,
    setOptions,
    setCharacters,
    setPlaces,
    setObjects,
    setEvents,
    setNotes,
    setResearchs,
  };
}
