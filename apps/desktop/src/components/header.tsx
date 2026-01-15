import React from "react";
import { Button } from "./ui/button";
import { Save } from "lucide-react";

export function Header() {
  return (
    <div className="bg-background h-20 w-full align-items-center flex justify-between border-b">
      <h1 className="text-xl font-bold text-secondary-900 p-6">Mon nouveau roman</h1>
      <div className="p-6">
        <Button variant="green" className="space-x-2">
          <Save className="w-4 h-4" />
          <span>Sauvegarder</span>
        </Button>
      </div>
    </div>
  );
}
