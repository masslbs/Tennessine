import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Store deno's web APIs and reassign them after happydom is registered
const denoAbortController = globalThis.AbortController;
const denoBlob = globalThis.Blob;
const denoFetch = globalThis.fetch;
const denoFile = globalThis.File;
const denoFileReader = globalThis.FileReader;
const denoFormData = globalThis.FormData;
const denoHeaders = globalThis.Headers;
const denoRequest = globalThis.Request;
const denoResponse = globalThis.Response;

GlobalRegistrator.register();

globalThis.AbortController = denoAbortController;
globalThis.Blob = denoBlob;
globalThis.fetch = denoFetch;
globalThis.File = denoFile;
globalThis.FileReader = denoFileReader;
globalThis.FormData = denoFormData;
globalThis.Headers = denoHeaders;
globalThis.Request = denoRequest;
globalThis.Response = denoResponse;
