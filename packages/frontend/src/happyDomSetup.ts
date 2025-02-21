import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";

// Store deno's web APIs and reassign them after happydom is registered
const denoFetch = globalThis.fetch;
const denoHeaders = globalThis.Headers;
const denoRequest = globalThis.Request;
const denoAbortController = globalThis.AbortController;

GlobalRegistrator.register();

globalThis.AbortController = denoAbortController;
globalThis.Headers = denoHeaders;
globalThis.Request = denoRequest;
globalThis.fetch = denoFetch;
