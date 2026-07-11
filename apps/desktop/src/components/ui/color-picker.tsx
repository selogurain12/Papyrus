import type { ColorType } from "@papyrus/source";
import { useTranslation } from "react-i18next";

import { cn } from "../../lib/utils";

interface ColorOption {
  value: ColorType;
  label: string;
  className: string;
}

interface ColorPickerProps {
  value: ColorType | null | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: ColorType) => void;
  className?: string;
}

const colorClassNames: Record<ColorType, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  yellow: "bg-yellow-500",
  pink: "bg-pink-500",
  cyan: "bg-cyan-500",
  gray: "bg-gray-500",
  orange: "bg-orange-500",
};

const colorValues: ColorType[] = [
  "blue",
  "red",
  "green",
  "purple",
  "yellow",
  "pink",
  "cyan",
  "gray",
  "orange",
];

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const { t } = useTranslation("ui/color-picker");
  const colors: ColorOption[] = colorValues.map((color) => ({
    value: color,
    label: t(`colors.${color}`),
    className: colorClassNames[color],
  }));

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={cn(
            "h-8 w-8 rounded-full transition-transform",
            color.className,
            value === color.value
              ? "ring-2 ring-foreground ring-offset-2 scale-110"
              : "hover:scale-105"
          )}
          title={color.label}
          aria-label={color.label}
          aria-pressed={value === color.value}
        />
      ))}
    </div>
  );
}
