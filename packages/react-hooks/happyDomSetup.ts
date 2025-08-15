import { GlobalRegistrator } from "@happy-dom/global-registrator";

/**
 * This function sets up HappyDOM for testing environments while ensuring that
 * Deno's built-in web APIs (like fetch, Blob, etc.) are preserved and restored
 * after HappyDOM registration.
 */
export const register = () => {
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
  const denoWritableStream = globalThis.WritableStream;
  const denoReadableStream = globalThis.ReadableStream;

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
  globalThis.WritableStream = denoWritableStream;
  globalThis.ReadableStream = denoReadableStream;
};

/**
 * This function cleans up the HappyDOM registration and restores the original
 * global environment. Should be called after testing is complete.
 */
export const unregister = () => {
  return GlobalRegistrator.unregister();
};
