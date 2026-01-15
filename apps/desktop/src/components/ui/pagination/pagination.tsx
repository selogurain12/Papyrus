import React, { type ComponentProps, type ReactNode } from "react";

import { cn } from "../../../lib/utils";

import { PaginationContent } from "./pagination-content";
import { PaginationEllipsis } from "./pagination-ellipsis";
import { PaginationItem } from "./pagination-item";
import { PaginationLink } from "./pagination-link";
import { PaginationNav } from "./pagination-nav";
import { PaginationNext } from "./pagination-next";
import { PaginationPrevious } from "./pagination-previous";
import { PaginationFirst } from "./pagination-first";
import { PaginationLast } from "./pagination-last";

export interface PaginationProps extends ComponentProps<"div"> {
  itemNumber: number;
  itemsPerPage: number;
  pageIndex: number;
  // eslint-disable-next-line no-unused-vars
  setPage: (name: number | undefined) => void;
}

export function Pagination({
  className,
  itemNumber,
  itemsPerPage,
  pageIndex,
  setPage,
}: PaginationProps) {
  const pageNumber =
    Math.ceil(itemNumber / itemsPerPage) === 0 ? 1 : Math.ceil(itemNumber / itemsPerPage);

  function renderItems(): ReactNode[] {
    const items: ReactNode[] = [];
    if (pageNumber > 3) {
      items.push(
        <PaginationItem key="first">
          <PaginationFirst
            disabled={pageIndex === 1}
            onClick={() => {
              setPage(1);
            }}
          />
        </PaginationItem>
      );
    }
    items.push(
      <PaginationItem key="previous">
        <PaginationPrevious
          disabled={pageIndex === 1}
          onClick={() => {
            setPage(pageIndex - 1);
          }}
        />
      </PaginationItem>
    );
    if (pageIndex > 2) {
      items.push(
        <PaginationItem key="ellipsis-previous">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    if (pageIndex > 1) {
      items.push(
        <PaginationItem key="beforeIndex">
          <PaginationLink
            onClick={() => {
              setPage(pageIndex - 1);
            }}
          >
            {pageIndex - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    items.push(
      <PaginationItem key="index">
        <PaginationLink
          isActive
          onClick={() => {
            setPage(pageIndex);
          }}
        >
          {pageIndex}
        </PaginationLink>
      </PaginationItem>
    );
    if (pageIndex < pageNumber) {
      items.push(
        <PaginationItem key="afterIndex">
          <PaginationLink
            onClick={() => {
              setPage(pageIndex + 1);
            }}
          >
            {pageIndex + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (pageNumber - pageIndex > 1) {
      items.push(
        <PaginationItem key="ellipsis-next">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          disabled={pageIndex === pageNumber}
          onClick={() => {
            setPage(pageIndex + 1);
          }}
        />
      </PaginationItem>
    );
    if (pageNumber > 3) {
      items.push(
        <PaginationItem key="last">
          <PaginationLast
            disabled={pageIndex === pageNumber}
            onClick={() => {
              setPage(pageNumber);
            }}
          />
        </PaginationItem>
      );
    }

    return items;
  }
  return (
    <PaginationNav className={cn(className)}>
      <PaginationContent className="py-2 px-4 rounded-t-lg">{renderItems()}</PaginationContent>
    </PaginationNav>
  );
}
