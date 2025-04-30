import { createServer } from "rolldown-vite";
import config from "./vite.ts";

const server = await createServer(
  config({ mode: "development", command: "serve" }),
);
await server.listen();
server.printUrls();
