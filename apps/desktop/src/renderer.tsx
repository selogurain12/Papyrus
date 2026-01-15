import { createRoot } from "react-dom/client";
import "./index.css";
import { Index } from "./components/app";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Index />);
