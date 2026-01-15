import { Group, Portal, RadioGroup, Root, Sub, Trigger } from "@radix-ui/react-dropdown-menu";

import { cn } from "../../../lib/utils";
import React from "react";

const dropdownMenu = Root;

const dropdownMenuTrigger = Trigger;

const dropdownMenuGroup = Group;

const dropdownMenuPortal = Portal;

const dropdownMenuSub = Sub;

const dropdownMenuRadioGroup = RadioGroup;

function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
  );
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  dropdownMenu as DropdownMenu,
  dropdownMenuTrigger as DropdownMenuTrigger,
  DropdownMenuShortcut,
  dropdownMenuGroup as DropdownMenuGroup,
  dropdownMenuPortal as DropdownMenuPortal,
  dropdownMenuSub as DropdownMenuSub,
  dropdownMenuRadioGroup as DropdownMenuRadioGroup,
};
