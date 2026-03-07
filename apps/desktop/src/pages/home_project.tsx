import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { projectHomeRoute } from "../routes/project/index.route";
import { Outlet } from "@tanstack/react-router";

export function HomeProject() {
  const { name } = projectHomeRoute.useParams();
  return (
    <div className="flex h-full min-h-screen bg-gray-50">
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
