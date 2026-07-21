import React, { useMemo } from "react";
import { LuPaintbrush } from "react-icons/lu";

import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "../../../lib/utils";
import { Input } from "../input";
import { Tabs } from "../tabs/tabs";
import { TabsList } from "../tabs/tab-list";
import { TabsTrigger } from "../tabs/tab-trigger";
import { TabsContent } from "../tabs/tab-content";
import { useTranslation } from "react-i18next";

const pickerColor = (id: string) => `rgb(var(--picker-${id}))`;
const pickerGradient = (...colors: string[]) =>
  `linear-gradient(to top left, ${colors.join(", ")})`;

export function GradientPicker({
  background,
  setBackground,
  className,
}: {
  background: string;
  // eslint-disable-next-line no-unused-vars
  setBackground: (background: string) => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const solids: string[] = [
    pickerColor("01"),
    pickerColor("02"),
    pickerColor("03"),
    pickerColor("04"),
    pickerColor("05"),
    pickerColor("06"),
    pickerColor("07"),
    pickerColor("08"),
    pickerColor("09"),
    pickerColor("10"),
    pickerColor("11"),
    pickerColor("12"),
    pickerColor("13"),
    pickerColor("14"),
    pickerColor("15"),
    pickerColor("16"),
  ];

  const gradients: string[] = [
    pickerGradient(pickerColor("17"), pickerColor("18")),
    pickerGradient(pickerColor("19"), pickerColor("19"), pickerColor("20")),
    pickerGradient(pickerColor("21"), pickerColor("22")),
    pickerGradient(pickerColor("08"), pickerColor("23")),
    pickerGradient(pickerColor("24"), pickerColor("25"), pickerColor("26")),
    pickerGradient(pickerColor("27"), pickerColor("28")),
    pickerGradient(pickerColor("29"), pickerColor("30")),
    pickerGradient(pickerColor("31"), pickerColor("32")),
    pickerGradient(pickerColor("33"), pickerColor("34")),
    pickerGradient(pickerColor("35"), pickerColor("36")),
    pickerGradient(pickerColor("37"), pickerColor("38")),
    pickerGradient(pickerColor("39"), pickerColor("40")),
    pickerGradient(pickerColor("41"), pickerColor("42"), pickerColor("43"), pickerColor("44")),
    pickerGradient(pickerColor("45"), pickerColor("46"), pickerColor("47")),
    pickerGradient(
      pickerColor("48"),
      pickerColor("49"),
      pickerColor("50"),
      pickerColor("51"),
      pickerColor("52"),
      pickerColor("53"),
      pickerColor("54")
    ),
    pickerGradient(
      pickerColor("02"),
      pickerColor("03"),
      pickerColor("04"),
      pickerColor("05"),
      pickerColor("06"),
      pickerColor("07")
    ),
    pickerGradient(pickerColor("55"), pickerColor("56")),
    pickerGradient(pickerColor("57"), pickerColor("58"), pickerColor("59")),
    pickerGradient(pickerColor("60"), pickerColor("61")),
    pickerGradient(pickerColor("62"), pickerColor("63")),
    pickerGradient(pickerColor("64"), pickerColor("65"), pickerColor("66")),
    pickerGradient(pickerColor("67"), pickerColor("68")),
    pickerGradient(pickerColor("69"), pickerColor("70")),
    pickerGradient(pickerColor("71"), pickerColor("72")),
    pickerGradient(pickerColor("73"), pickerColor("74")),
    pickerGradient(pickerColor("75"), pickerColor("76")),
    pickerGradient(pickerColor("77"), pickerColor("78")),
    pickerGradient(pickerColor("79"), pickerColor("80")),
    pickerGradient(pickerColor("81"), pickerColor("82"), pickerColor("83"), pickerColor("84")),
    pickerGradient(pickerColor("85"), pickerColor("86"), pickerColor("87")),
    pickerGradient(
      pickerColor("88"),
      pickerColor("89"),
      pickerColor("90"),
      pickerColor("91"),
      pickerColor("92"),
      pickerColor("93"),
      pickerColor("94")
    ),
    pickerGradient(
      pickerColor("95"),
      pickerColor("96"),
      pickerColor("97"),
      pickerColor("98"),
      pickerColor("99"),
      pickerColor("100")
    ),
  ];
  const defaultTab = useMemo(() => {
    if (background.includes("url")) {
      return "image";
    }
    if (background.includes("gradient")) {
      return "gradient";
    }
    return "solid";
  }, [background]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-start text-left font-normal px-3",
            !background && "text-muted-foreground",
            className
          )}
          variant="outline"
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              />
            ) : (
              <LuPaintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">{background || t("pickColor")}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs className="w-full" defaultValue={defaultTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="solid">
              {t("solid")}
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="gradient">
              {t("gradient")}
            </TabsTrigger>
          </TabsList>

          <TabsContent className="flex flex-wrap gap-1 mt-0" value="solid">
            {solids.map((item) => (
              <button
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                key={item}
                onClick={() => {
                  setBackground(item);
                }}
                style={{ background: item }}
                type="button"
              />
            ))}
          </TabsContent>

          <TabsContent className="mt-0" value="gradient">
            <div className="flex flex-wrap gap-1 mb-2">
              {gradients.map((item) => (
                <button
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  key={item}
                  onClick={() => {
                    setBackground(item);
                  }}
                  style={{ background: item }}
                  type="button"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Input
          className="col-span-2 h-8 mt-4"
          id="custom"
          placeholder={t("color.customPlaceholder")}
          onChange={(event) => {
            setBackground(event.currentTarget.value);
          }}
          value={background}
        />
      </PopoverContent>
    </Popover>
  );
}
