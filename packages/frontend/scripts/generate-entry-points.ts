import { routeTree } from "../src/routeTree.gen.ts";

// Slice off the leading slash for each path and remove the index route.
const entryPoints = Object.values(routeTree.children || {})
  .map((r) => r.options.path.slice(1))
  .slice(1);

for (const entry of entryPoints) {
  await Deno.mkdir(`dist/${entry}`, { recursive: true });
  await Deno.copyFile("dist/index.html", `dist/${entry}/index.html`);
}
