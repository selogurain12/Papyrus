import { ListResult } from "@papyrus/source";
import { QueryClient } from "@tanstack/react-query";
import type { ErrorHttpStatusCode } from "@ts-rest/core";

interface Option {
  status: ErrorHttpStatusCode;
  body: ListResult<unknown>;
  headers: Headers;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 30_000,
      refetchOnWindowFocus: true,

      //@ts-expect-error - This is a custom function
      getNextPageParam: (lastPage: Option, pages: Option[]) => {
        const lastPageNumber = lastPage.body.total;
        const totalCurrentPages = pages
          .map((page) => page.body.data.length)
          .reduce((accumulator, current) => accumulator + current, 0);

        if (totalCurrentPages < lastPageNumber || lastPage.body.data.length === 0) {
          return pages.length + 1;
        }
        return undefined;
      },

      getPreviousPageParam: (firstPage, pages) => pages.length - 1,
    },
  },
});
