/* eslint-disable max-len */
import React from "react";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  name: string;
}

export function Header({ name }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-background h-20 w-full align-items-center flex justify-between border-b border-gray-300">
      <h1 className="text-xl font-bold text-secondary-900 p-6">{name}</h1>
      <div className="p-6">
        <Button variant="green" className="space-x-2">
          <Save className="w-4 h-4" />
          <span>{t("save")}</span>
        </Button>
      </div>
    </div>
  );
}
