import { renderHook, waitFor } from "@testing-library/react";
import { MemoryLevel } from "memory-level";
import { expect } from "@std/expect";

import StateManager from "@massmarket/stateManager";
// import { allListings } from "@massmarket/schema/testFixtures";

import { useStateManager } from "./useStateManager.ts";
import { createWrapper, testWrapper } from "./_createWrapper.tsx";
import { useKeycard } from "./useKeycard.ts";

const denoTestOptions = {
  sanitizeResources: false,
  sanitizeOps: false,
};

const db = new MemoryLevel<
  Uint8Array,
  Uint8Array
>({
  valueEncoding: "view",
  keyEncoding: "view",
});

Deno.test(
  "useStateManager",
  denoTestOptions,
  testWrapper(
    async (shopId, t) => {
      await t.step("Enroll merchant keycard.", async () => {
        const { result, unmount } = renderHook(
          () => useKeycard({ role: "merchant" }),
          {
            wrapper: createWrapper(shopId),
          },
        );
        await waitFor(() => {
          expect(result.current.data?.role).toEqual("merchant");
        });
        unmount();
      });

      await t.step("StateManager is returned.", async () => {
        const { result, unmount } = renderHook(
          () => useStateManager({ db }),
          { wrapper: createWrapper(shopId) },
        );

        await waitFor(() => {
          expect(result.current.data).toBeDefined();
          expect(result.current.data).toBeInstanceOf(StateManager);
        });
        unmount();
      });

      // await t.step("Add a listing using stateManager", async () => {
      //   const { result, unmount } = renderHook(
      //     () => useStateManager({ db }),
      //     { wrapper: createWrapper(shopId) },
      //   );

      //   await waitFor(() => {
      //     expect(result.current.data).toBeDefined();
      //     expect(result.current.data).toBeInstanceOf(StateManager);
      //   });
      //   for (const [key, entry] of allListings.entries()) {
      //     await result.current.data.set(["Listings", key], entry);
      //   }

      //   await waitFor(() => {
      //     expect(result.current.data.get(["Listings"])).toBeDefined();
      //   });

      //   unmount();
      // });
    },
  ),
);
