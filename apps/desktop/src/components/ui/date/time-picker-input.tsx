/* eslint-disable max-len */
import React, {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  useEffect,
  useMemo,
  type KeyboardEvent,
} from "react";

import {
  getArrowByType,
  getDateByType,
  setDateByType,
  type TimePickerType,
} from "../../../utils/time-picker-utils";
import { cn } from "../../../lib/utils";

interface TimePickerInputProps extends InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Date | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}
const timePickerInput = forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    {
      className,
      type = "tel",
      value,
      id,
      name,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      onChange,
      onKeyDown,
      picker,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    reference
  ) => {
    const [flag, setFlag] = useState<boolean>(false);

    useEffect((): void => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        clearTimeout(timer);
      }
    }, [flag]);

    const calculatedValue = useMemo(() => getDateByType(date, picker), [date, picker]);

    // eslint-disable-next-line complexity
    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === "Tab") {
        return;
      }
      event.preventDefault();
      if (event.key === "ArrowRight") {
        onRightFocus?.();
      }
      if (event.key === "ArrowLeft") {
        onLeftFocus?.();
      }
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        const step = event.key === "ArrowUp" ? 1 : -1;
        const newValue = getArrowByType(calculatedValue, step, picker);
        if (flag) {
          setFlag(false);
        }
        const temporaryDate = new Date(date);
        setDate(setDateByType(temporaryDate, newValue, picker));
      }
      if (event.key >= "0" && event.key <= "9") {
        const newValue = flag ? calculatedValue.slice(1, 2) + event.key : `0${event.key}`;
        if (flag) {
          onRightFocus?.();
        }
        setFlag((previous) => !previous);
        const temporaryDate = new Date(date);
        setDate(setDateByType(temporaryDate, newValue, picker));
      }
    }

    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-popover focus:text-popover-foreground [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        id={id ?? picker}
        inputMode="decimal"
        name={name ?? picker}
        onChange={(event) => {
          event.preventDefault();
          onChange?.(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          handleKeyDown(event);
        }}
        ref={reference}
        type={type}
        value={value ?? calculatedValue}
        {...props}
      />
    );
  }
);

timePickerInput.displayName = "TimePickerInput";

export { timePickerInput as TimePickerInput };
