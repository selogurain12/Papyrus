import { Outlet } from "@tanstack/react-router";

export function DefaultLayout() {
  return (
    <div className="h-screen relative flex">
      <main className="h-full w-full flex-auto overflow-auto antialiased">
        <Outlet />
      </main>
    </div>
  );
}
