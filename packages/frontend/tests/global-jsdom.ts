// register dom globals
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
GlobalRegistrator.register();
// create a new window, base url doesn't matter
const window = new Window({ url: "https://localhost:8080" });
globalThis.window = window;
