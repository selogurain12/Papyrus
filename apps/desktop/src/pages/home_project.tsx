import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { projectHomeRoute } from "../routes/project/index.route";
import { Outlet } from "@tanstack/react-router";
import { ShortcutHandler } from "../components/shortcuts/shortcut-handler";

export function HomeProject() {
  const { name } = projectHomeRoute.useParams();
  return (
    <div className="flex h-full min-h-screen bg-background text-foreground">
      <ShortcutHandler projectName={name} />
      <div className="sticky top-0 h-screen overflow-hidden">
        <Sidebar name={name} />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header name={name} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
