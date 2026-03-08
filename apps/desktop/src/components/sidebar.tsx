/* eslint-disable max-len */
import {
  Home,
  Users,
  MapPin,
  Package,
  BookOpen,
  Search,
  PenTool,
  Calendar,
  Layers,
  GitBranch,
  StickyNote,
  Download,
  FolderOpen,
} from "lucide-react";
import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { useNavigate } from "@tanstack/react-router";
import { indexRoute } from "../routes/index.routes";
import { characterRoute } from "../routes/character/index.route";
import { placeRoute } from "../routes/place/index.route";
import { objectRoute } from "../routes/object/index.route";

const menu = [
  { id: "dashboard", label: "Tableau de bord", icon: Home, path: characterRoute },
  { id: "characters", label: "Personnages", icon: Users, path: characterRoute },
  { id: "places", label: "Lieux", icon: MapPin, path: placeRoute },
  { id: "objects", label: "Objets", icon: Package, path: objectRoute },
  { id: "chapters", label: "Chapitres", icon: BookOpen, path: characterRoute },
  { id: "research", label: "Recherches", icon: Search, path: characterRoute },
  { id: "writing-tools", label: "Outils d'écriture", icon: PenTool, path: characterRoute },
  { id: "timeline", label: "Chronologie", icon: Calendar, path: characterRoute },
  { id: "structure", label: "Structure", icon: Layers, path: characterRoute },
  { id: "mind-maps", label: "Cartes mentales", icon: GitBranch, path: characterRoute },
  { id: "notes", label: "Notes", icon: StickyNote, path: characterRoute },
  { id: "export", label: "Export", icon: Download, path: characterRoute },
];

interface SidebarProps {
  name: string;
}

export function Sidebar({ name }: SidebarProps) {
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();
  return (
    <div className="w-64 bg-background shadow-lg border-r border-gray-300 h-full">
      <div className="p-6 border-b border-gray-300">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary-900">Papyrus</h1>
            <p className="text-sm text-secondary-500">Studio d'écriture</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 bg-blue-200 rounded-xl p-2">
          <div>
            <p className="text-sm text-blue-600">Projet actuel</p>
            <p className="text-sm text-blue-900">{name}</p>
          </div>
          <div className="w-5 h-5 flex items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    void navigate({ to: indexRoute.to });
                  }}
                >
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Retour aux projets</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1 px-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveView(item.id);
                    void navigate({ to: item.path.to, params: { name: name } });
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-secondary-400"}`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
