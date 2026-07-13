/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */

import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { CommandInput } from "cmdk";
import { debounce } from "lodash";
import { ChevronsUpDown, CircleIcon, X } from "lucide-react";
import {
  Fragment,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Waypoint } from "react-waypoint";

import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./commands";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Spinner } from "./spinner";
import { ApiResponse, ListResult } from "@papyrus/source";

interface MultipleSelectorProps<Option extends { id: string }> {
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  contentClassName?: string;
  customDisplay?: (option: Option) => ReactNode;
  customLabel?: (option: Option) => ReactNode;

  data?: Option[];
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;

  disabled?: boolean;

  displayKey?: keyof Option;
  errorIcon?: boolean;
  /** Fetch next page function. */
  fetchNextPage?: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<ApiResponse<ListResult<Option>>>, unknown>>;

  inputPlaceholder?: string;

  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandInput>,
    "disabled" | "placeholder" | "value"
  >;
  isError?: boolean;
  isFetchingNextPage?: boolean;

  /** Loading component. */
  loadingIndicator?: React.ReactNode;

  onChange?: (options: Option[]) => void;

  onSearch: (value: string | undefined) => void;

  /** manually controlled options */
  placeholder?: string;
  selectFirstItem?: boolean;

  value?: Option[];
}

function safeRenderValue<Option extends { id: string }>(
  item: Partial<Option> | undefined,
  key: keyof Option
): string {
  if (!item || !(key in item)) return "N/A";

  const value = item[key];
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

// eslint-disable-next-line complexity
export function MultipleSelector<Option extends { id: string }>({
  value = [],
  onChange,
  errorIcon = false,
  isError = false,
  placeholder,
  inputPlaceholder,

  data = [],
  delay,
  onSearch,
  loadingIndicator,
  disabled,
  customDisplay,
  customLabel,
  fetchNextPage,
  isFetchingNextPage = false,

  displayKey = "name" as keyof Option,
  selectFirstItem = true,
  commandProps,
  inputProps,
  contentClassName = "",
}: MultipleSelectorProps<Option>) {
  const inputReference = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState<Option[]>(value);

  const [inputValue, setInputValue] = useState("");

  const debouncedOnSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value === "" ? undefined : value);

        setIsLoading(false);
      }, delay ?? 500),

    [delay, onSearch]
  );

  const handleUnselect = useCallback(
    (value: Option) => {
      setSelected((previous) => {
        if (previous.length === 1 && previous[0]?.id === value.id) {
          return [];
        }
        return previous.filter((option) => option.id !== value.id);
      });
      const selectedItem = selected.filter((option) => option.id !== value.id);

      onChange?.(selectedItem);
    },

    [onChange, selected]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputReference.current;

      if (input) {
        if (
          (event.key === "Delete" || event.key === "Backspace") &&
          input.value === "" &&
          selected.length > 0
        ) {
          const lastSelected = selected.at(-1);
          if (lastSelected) {
            handleUnselect(lastSelected);
          }
        }

        // This is not a default behaviour of the <input /> field

        if (event.key === "Escape") {
          input.blur();
        }
      }
    },

    [handleUnselect, selected]
  );

  const handleSelect = useCallback(
    (value: Option) => {
      setInputValue("");

      debouncedOnSearch("");

      setSelected((previous) => [...previous, value]);

      onChange?.([...selected, value]);
      setOpen(false);
    },

    [debouncedOnSearch, onChange, selected]
  );

  const removePickedOptions = useCallback(
    (data: Option[] | undefined, picked: Option[] | undefined) => {
      if (picked) {
        return data?.filter((option) => !picked.some((part) => part.id === option.id)) ?? [];
      }

      return data ?? [];
    },
    []
  );

  const selectables = useMemo<Option[]>(
    () => removePickedOptions(data, selected),
    [data, removePickedOptions, selected]
  );

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "justify-between px-3 h-auto w-full truncate rounded-xl",
            selected.length > 0 && "text-left",
            selected.length === 0 && "text-placeholder font-normal",
            disabled !== undefined && disabled && "bg-muted disabled:opacity-80",
            isError && (disabled === false || disabled === undefined) && "border-destructive",
            isError &&
              (disabled === false || disabled === undefined) &&
              selected.length > 0 &&
              "text-destructive"
          )}
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault();

            setOpen((previous) => !previous);
          }}
          variant="outline"
        >
          <div className="group flex items-center">
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selected.map((item) => (
                  <Badge
                    className={cn(
                      "data-disabled:bg-muted-foreground data-disabled:text-muted data-disabled:hover:bg-muted-foreground",
                      "data-fixed:bg-muted-foreground data-fixed:text-muted data-fixed:hover:bg-muted-foreground text-xxs xl:text-xs text-foreground max-w-[24rem] truncate text-start"
                    )}
                    key={item.id}
                    variant="secondary"
                  >
                    <span className="line-clamp-1 truncate">
                      {customLabel?.(item) ?? safeRenderValue(item, displayKey)}
                    </span>
                    <button
                      className={cn(
                        "ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        (disabled ?? false) && "hidden"
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        handleUnselect(item);
                        event.stopPropagation();
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      type="button"
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {selected.length === 0 && value.length === 0 && (
              <p className="truncate ml-2">{placeholder ?? "Sélectionnez des options"}</p>
            )}
          </div>

          {errorIcon && isError && (disabled === undefined || !disabled) ? (
            <CircleIcon className="w-6 h-6 text-destructive ml-2" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-(--radix-popover-trigger-width) max-h-(--radix-popover-content-available-height)",
          contentClassName
        )}
      >
        <Command
          className="w-full truncate"
          onKeyDown={(event) => {
            handleKeyDown(event);

            commandProps?.onKeyDown?.(event);
          }}
          shouldFilter={
            commandProps?.shouldFilter === undefined ? !onSearch : commandProps.shouldFilter
          }
        >
          <CommandInput
            className="h-9 truncate px-2"
            disabled={disabled}
            onBlur={(event) => {
              inputProps?.onBlur?.(event);
            }}
            onFocus={(event) => {
              setOpen(true);

              inputProps?.onFocus?.(event);
            }}
            onValueChange={(value) => {
              setIsLoading(true);

              setInputValue(value);

              debouncedOnSearch(value);

              inputProps?.onValueChange?.(value);
            }}
            placeholder={inputPlaceholder}
            ref={inputReference}
            value={inputValue}
          />

          {!isLoading && <CommandEmpty>Aucun résultat.</CommandEmpty>}
          <CommandList>
            <CommandGroup className="overflow-y-auto h-full max-h-[20dvh]">
              {isLoading ? (
                <div>{loadingIndicator ?? <Spinner />}</div>
              ) : (
                <>
                  {!selectFirstItem && <CommandItem className="hidden" value="-" />}

                  {selectables.length === 0 ? (
                    <CommandItem className="cursor-not-allowed" value="-">
                      <p className="truncate">Aucun résultat supplémentaire.</p>
                    </CommandItem>
                  ) : (
                    selectables.map((item, index) => (
                      <Fragment key={item.id}>
                        {selectables.length - 3 === index && (
                          <Waypoint
                            key={item.id}
                            onEnter={() => {
                              if (fetchNextPage && !isFetchingNextPage) {
                                void fetchNextPage();
                              }
                            }}
                          />
                        )}
                        <CommandItem
                          className={cn("cursor-pointer w-full")}
                          key={item.id}
                          onMouseDown={(event) => {
                            event.preventDefault();

                            event.stopPropagation();
                          }}
                          onSelect={() => {
                            handleSelect(item);
                          }}
                          value={item.id}
                        >
                          {customDisplay ? (
                            customDisplay(item)
                          ) : (
                            <p className="truncate">{safeRenderValue(item, displayKey)}</p>
                          )}
                        </CommandItem>
                      </Fragment>
                    ))
                  )}
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
