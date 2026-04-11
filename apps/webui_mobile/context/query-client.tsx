import { ListResult } from "@papyrus/source";
import { QueryClient } from "@tanstack/react-query";

interface Option {
  body: ListResult<unknown>;
  headers: Headers;
  status: number;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  },
});

export function getNextPageParameter(lastPage: Option, pages: Option[]): number | undefined {
  const lastPageNumber = lastPage.body.total;
  const totalCurrentPages = pages
    .map((page) => page.body.data.length)
    .reduce((accumulator, current) => accumulator + current, 0);

  if (totalCurrentPages < lastPageNumber || lastPage.body.data.length === 0) {
    return pages.length + 1;
  }
  return undefined;
}

export function getPreviousPageParameter(firstPage: Option, pages: Option[]): number | undefined {
  return pages.length - 1;
}
