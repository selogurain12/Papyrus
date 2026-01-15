import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function Index() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="w-full">
        <Header />
      </main>
    </div>
  );
}
