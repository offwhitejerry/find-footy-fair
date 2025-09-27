import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { updateMetaTags } from "./lib/head";

// Update meta tags with site config
updateMetaTags();

createRoot(document.getElementById("root")!).render(<App />);
