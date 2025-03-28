import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Store deno's web APIs and reassign them after happydom is registered
const denoFetch = globalThis.fetch;
const denoBlob = globalThis.Blob;
const denoHeaders = globalThis.Headers;
const denoRequest = globalThis.Request;
const denoResponse = globalThis.Response;
const denoAbortController = globalThis.AbortController;

GlobalRegistrator.register();

globalThis.AbortController = denoAbortController;
globalThis.Blob = denoBlob;
globalThis.Headers = denoHeaders;
globalThis.Request = denoRequest;
globalThis.Response = denoResponse;
globalThis.fetch = denoFetch;
