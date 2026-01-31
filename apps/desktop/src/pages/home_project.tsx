import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { projectHomeRoute } from "../routes/project/index.route";

export function HomeProject() {
  const { name } = projectHomeRoute.useParams();
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar name={name} />
      <main className="w-full">
        <Header name={name} />
      </main>
    </div>
  );
}
