import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { useKeycard } from "./useKeycard.ts";
import {
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";

Deno.test(
  "Enroll guest/merchantkeycard.",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("enroll merchant card", async () => {
      const { result, unmount } = renderHook(
        () => useKeycard(),
        {
          wrapper: createWrapper(shopId),
        },
      );
      await waitFor(() => {
        expect(result.current.keycard?.role).toEqual("merchant");
      });
      unmount();
    });

    await t.step("enroll guest card", async () => {
      const { result, unmount } = renderHook(
        () => useKeycard(),
        // createWrapper is called with setupMockConnectors = false, so we don't connect to a test account.
        {
          wrapper: createWrapper(shopId, 0, false),
        },
      );
      await waitFor(() => {
        expect(result.current.data?.role).toEqual("guest");
      });
      unmount();
    });
  }),
);

Deno.test(
  "Hook should return error if keycard enrollment fails",
  denoTestOptions,
  testWrapper(async (shopId) => {
    // Enroll should fail since relay expects first keycard enrollment for a shop to be merchant.
    const wrapper = createWrapper(shopId, 0, false);
    const { result } = renderHook(() => useKeycard(), { wrapper });
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.error).toBeInstanceOf(Error);
    });
  }),
);
