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
} from "lucide-react";
import React, { useState } from "react";

const menu = [
  { id: "dashboard", label: "Tableau de bord", icon: Home },
  { id: "characters", label: "Personnages", icon: Users },
  { id: "places", label: "Lieux", icon: MapPin },
  { id: "objects", label: "Objets", icon: Package },
  { id: "chapters", label: "Chapitres", icon: BookOpen },
  { id: "research", label: "Recherches", icon: Search },
  { id: "writing-tools", label: "Outils d'écriture", icon: PenTool },
  { id: "timeline", label: "Chronologie", icon: Calendar },
  { id: "structure", label: "Structure", icon: Layers },
  { id: "mind-maps", label: "Cartes mentales", icon: GitBranch },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "export", label: "Export", icon: Download },
];

export function Sidebar() {
  const [activeView, setActiveView] = useState("dashboard");
  return (
    <div className="w-64 bg-background shadow-lg border-r border-gray-300">
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
      </div>

      <nav className="mt-6">
        <ul className="space-y-1 px-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
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
