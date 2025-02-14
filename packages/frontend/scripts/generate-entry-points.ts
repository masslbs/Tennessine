import { routeTree } from "../src/routeTree.gen.ts";

// Slice off the leading slash for each path and remove the index route.
export const entryPoints = Object.values(routeTree.children || {})
  .map((r) => r.options.path.slice(1))
  .slice(1);

// usually run by deno task generate, as part of the production pipline
if (import.meta.main) {
  console.log("Copying index.html for each entry point...");
  for (const entry of entryPoints) {
    await Deno.mkdir(`dist/${entry}`, { recursive: true });
    await Deno.copyFile("dist/index.html", `dist/${entry}/index.html`);
  }
}
