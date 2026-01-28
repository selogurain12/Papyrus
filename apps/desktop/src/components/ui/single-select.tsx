/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import { ChevronsUpDown, CircleIcon, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  useMemo,
  Fragment,
  type ReactNode,
} from "react";
import { debounce } from "lodash";
import { Waypoint } from "react-waypoint";
import type { InfiniteQueryObserverResult } from "@tanstack/react-query";
import type { ErrorHttpStatusCode } from "@ts-rest/core";

import { cn } from "../../lib/utils";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "./commands";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Spinner } from "./spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { ApiResponse, ListResult } from "@papyrus/source";

interface SingleSelectorProps<Option extends { id: string }> {
  value?: Partial<Option>;
  data?: Option[];
  isUpdate?: boolean;

  errorIcon?: boolean;
  isError?: boolean;

  /** manually controlled options */
  placeholder?: string;
  inputPlaceholder?: string;

  /** Loading component. */
  isLoading?: boolean;
  loadingIndicator?: React.ReactNode;

  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;

  onSearch?: (value: string | undefined) => void;
  onChange?: (option: Option | undefined) => void;

  disabled?: boolean;
  displayKey?: keyof Option;
  customDisplay?: (option: Option) => ReactNode;
  customLabel?: (option: Option) => ReactNode;

  /** Fetch next page function. */
  fetchNextPage?: () => Promise<
    InfiniteQueryObserverResult<
      ApiResponse<ListResult<Option>>,
      { status: ErrorHttpStatusCode; body: unknown; headers: Headers }
    >
  >;
  isFetchingNextPage?: boolean;

  /**
   * First item selected is a default behavior by cmdk.
   * That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;

  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;

  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandInput>,
    "disabled" | "placeholder" | "value"
  >;

  classPopover?: string;
  hasTooltip?: boolean;
}

function removePickedOption<Option extends { id: string }>(
  data: Option[] | undefined,
  picked: Option | undefined
) {
  if (picked) {
    return data?.filter((option) => option.id !== picked.id) ?? [];
  }
  return data ?? [];
}

export function SingleSelector<Option extends { id: string }>({
  value,
  onChange,
  isUpdate = false,
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
  isLoading: isLoadingData = false,

  displayKey = "name" as keyof Option,
  selectFirstItem = true,
  commandProps,
  inputProps,
  hasTooltip = false,
}: SingleSelectorProps<Option>) {
  const inputReference = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(isLoadingData);

  const [selected, setSelected] = useState<Option | undefined>(value as Option | undefined);
  const [inputValue, setInputValue] = useState("");
  const debouncedOnSearch = useMemo(() => {
    if (!onSearch) return undefined;

    return debounce((value: string) => {
      onSearch(value === "" ? undefined : value);
      setIsLoading(false);
    }, delay ?? 500);
  }, [delay, onSearch]);

  const handleUnselect = useCallback(() => {
    setSelected(undefined);
    onChange?.(undefined);
  }, [selected]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputReference.current;
      if (input) {
        if (
          (event.key === "Delete" || event.key === "Backspace") &&
          input.value === "" &&
          selected
        ) {
          handleUnselect();
        }

        // This is not a default behaviour of the <input /> field
        if (event.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected]
  );

  const handleSelect = useCallback(
    (value: Option) => {
      setInputValue("");
      debouncedOnSearch?.("");
      setSelected(value);
      onChange?.(value);
      setOpen(false);
    },
    [debouncedOnSearch, onChange]
  );

  useEffect(() => {
    if (value !== undefined && selected === undefined) {
      setSelected(undefined);
    } else {
      setSelected(value as Option);
    }
  }, [value, selected]);

  useEffect(() => {
    setIsLoading(isLoadingData);
  }, [isLoadingData]);

  const selectables = useMemo<Option[]>(() => removePickedOption(data, selected), [data, selected]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild className="flex w-full items-center">
            <Button
              className={cn(
                "justify-between px-3 md:px-zoom-3 rounded-md w-full border-gray-300",
                !value && "text-placeholder font-normal",
                isError && (disabled === false || disabled === undefined) && "border-destructive",
                isError &&
                  (disabled === false || disabled === undefined) &&
                  value &&
                  "text-destructive"
              )}
              disabled={disabled}
              onClick={() => {
                setOpen((previous) => !previous);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setOpen((previous) => !previous);
                }
              }}
              type="button"
              variant="outline"
            >
              <div className="max-w-[30rem] md:max-w-[--radix-popover-trigger-width] truncate text-start">
                {selected && value ? (
                  <div className="group flex items-center">
                    <div className="flex flex-wrap gap-1">
                      <span className="max-w-[30rem] truncate text-start">
                        {customLabel?.(selected) ?? (value[displayKey] as ReactNode)}
                      </span>
                      {isUpdate === false && (
                        <button
                          className={cn(
                            "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            (disabled ?? false) && "hidden"
                          )}
                          onClick={(event) => {
                            event.preventDefault();
                            handleUnselect();
                            event.stopPropagation();
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              handleUnselect();
                            }
                          }}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          type="button"
                        >
                          <X className="h-3 w-3 hover:text-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="truncate ml-2">{placeholder ?? "Sélectionnez une option"}</p>
                )}
              </div>
              {errorIcon && isError && (disabled === undefined || !disabled) ? (
                <CircleIcon className="size-6 md:size-zoom-6 text-destructive ml-2" />
              ) : (
                <ChevronsUpDown className="ml-2 md:ml-zoom-2 size-4 md:size-zoom-4 shrink-0 opacity-50" />
              )}
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        {hasTooltip && value !== undefined && (
          <TooltipContent>{value[displayKey] as ReactNode}</TooltipContent>
        )}
      </Tooltip>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        collisionPadding={12}
        sticky="partial"
        className="bg-white"
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
            className="h-9 md:h-zoom-9 truncate"
            disabled={disabled}
            onBlur={(event) => {
              event.preventDefault();
              inputProps?.onBlur?.(event);
            }}
            onFocus={(event) => {
              event.preventDefault();
              inputProps?.onFocus?.(event);
            }}
            onValueChange={(value) => {
              setIsLoading(true);
              setInputValue(value);
              debouncedOnSearch?.(value);
              inputProps?.onValueChange?.(value);
            }}
            placeholder={inputPlaceholder}
            ref={inputReference}
            value={inputValue}
          />
          <CommandList className="max-h-56 overflow-y-auto w-full">
            {!isLoading && <CommandEmpty>Aucun résultat.</CommandEmpty>}
            <CommandGroup>
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
                        {selectables.length - 4 === index && (
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
                            <p className="truncate">{item[displayKey] as ReactNode}</p>
                          )}
                        </CommandItem>
                      </Fragment>
                    ))
                  )}
                </>
              )}
              {isFetchingNextPage && (
                <CommandItem className="cursor-not-allowed text-center" value="-">
                  <Spinner />
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
