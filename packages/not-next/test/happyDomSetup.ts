// register dom globals
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
GlobalRegistrator.register();
// create a new window, base url doesn't matter
// @ts-ignore: globalThis.window is from deno, and we are overwriting it one that comes from happy-dom
globalThis.window = new Window({ url: "https://localhost:877" });
