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
  const solids: string[] = [
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
    "#6F3535",
    "#9BF866",
    "#39E411",
    "#DB8EA8",
    "#D54C5A",
    "#625956",
    "#8E604C",
    "#05E85A",
  ];

  const gradients: string[] = [
    "linear-gradient(to top left,#accbee,#e7f0fd)",
    "linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)",
    "linear-gradient(to top left,#000000,#434343)",
    "linear-gradient(to top left,#09203f,#537895)",
    "linear-gradient(to top left,#AC32E4,#7918F2,#4801FF)",
    "linear-gradient(to top left,#f953c6,#b91d73)",
    "linear-gradient(to top left,#ee0979,#ff6a00)",
    "linear-gradient(to top left,#F00000,#DC281E)",
    "linear-gradient(to top left,#00c6ff,#0072ff)",
    "linear-gradient(to top left,#4facfe,#00f2fe)",
    "linear-gradient(to top left,#0ba360,#3cba92)",
    "linear-gradient(to top left,#FDFC47,#24FE41)",
    "linear-gradient(to top left,#8a2be2,#0000cd,#228b22,#ccff00)",
    "linear-gradient(to top left,#40E0D0,#FF8C00,#FF0080)",
    "linear-gradient(to top left,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)",
    "linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)",
    "linear-gradient(to top left, #F695B5, #AFB24D)",
    "linear-gradient(to top left, #E74892, #64BA5F, #98AC03)",
    "linear-gradient(to top left, #A8F543, #3C88D3)",
    "linear-gradient(to top left, #B83B38, #AF9549)",
    "linear-gradient(to top left, #87185D, #92A615, #75B73A)",
    "linear-gradient(to top left, #4E4464, #CC6680)",
    "linear-gradient(to top left, #863810, #021C61)",
    "linear-gradient(to top left, #B3767A, #7DD4AB)",
    "linear-gradient(to top left, #BF1790, #C55CB7)",
    "linear-gradient(to top left, #B780DD, #DACF54)",
    "linear-gradient(to top left, #4000CA, #785C29)",
    "linear-gradient(to top left, #C24735, #2EF3D4)",
    "linear-gradient(to top left, #259069, #6BE980, #6094BF, #E09EF4)",
    "linear-gradient(to top left, #BFB7D3, #9DD540, #F41E1C)",
    "linear-gradient(to top left, #04636D, #642164, #A70BAB, #4F7AAA, #D96CEB, #800073, #E3F647)",
    "linear-gradient(to top left, #2FB7B0, #F7C860, #F61F13, #CEDBBE, #7E1E67, #ABC289)",
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
            <div className="truncate flex-1">{background || "Pick a color"}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs className="w-full" defaultValue={defaultTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="solid">
              Uni
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="gradient">
              Dégradé
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
          onChange={(event) => {
            setBackground(event.currentTarget.value);
          }}
          value={background}
        />
      </PopoverContent>
    </Popover>
  );
}
