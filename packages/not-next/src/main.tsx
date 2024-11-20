import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import App from "./App.tsx";
import { routeTree } from "./routeTree.gen.ts";

const router = createRouter({ routeTree });

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
    <App />
  </StrictMode>,
);
