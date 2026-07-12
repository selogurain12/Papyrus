import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/index";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./context/query-client";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./context/auth-provider";
import { ProjectProvider } from "./context/project-provider";
import { PreferencesProvider } from "./context/preference-provider";
import { NotificationManager } from "./components/notifications/notification-manager";
import { OfflineSyncManager } from "./components/offline-sync/offline-sync-manager";
import "@fontsource/inter";
import "@fontsource/lora";
import "@fontsource/merriweather";
import "@fontsource/source-serif-4";

const container = document.querySelector("#root");

if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProjectProvider>
          <PreferencesProvider>
            <main>
              <TooltipProvider>
                <Toaster richColors />
                <NotificationManager />
                <OfflineSyncManager />
                <RouterProvider basepath={import.meta.env.BASE_URL} router={router} />
              </TooltipProvider>
            </main>
          </PreferencesProvider>
        </ProjectProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
