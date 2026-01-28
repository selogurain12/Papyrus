import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/index";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./context/query-client";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./context/auth-provider";

const container = document.querySelector("#root");

const root = createRoot(container!);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <main>
          <TooltipProvider>
            <Toaster richColors />
            <RouterProvider basepath={import.meta.env.BASE_URL} router={router} />
          </TooltipProvider>
        </main>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
