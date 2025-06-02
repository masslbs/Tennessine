import { renderHook, waitFor } from "@testing-library/react";
import { MemoryLevel } from "memory-level";
import { expect } from "@std/expect";

import StateManager from "@massmarket/stateManager";
import { allListings } from "@massmarket/schema/testFixtures";

import { useStateManager } from "./useStateManager.ts";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  testWrapper,
} from "./_createWrapper.tsx";

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
  "useStateManager hook",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    // We want to add listings to a shop, then test that the StateManager that is returned by the hook,
    // which is a separate instance of the StateManager than the one we used to add the listings, also contains the listings.
    // This will test that the StateManager successfully addedConnection to the given shop's relayClient.
    // 1. create test relay client
    // 2. enroll merchant keycard to make writes to the shop
    // 3. create test state manager
    // 4. connect, authenticate, and add connection of relay client to state manager
    // 5. add listings to the state manager
    // 6. render the useStateManager hook, and check that the new instance of the state manager contains the listings.

    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);

    await t.step("Add a listing to the shop", async () => {
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      for (const [key, entry] of allListings.entries()) {
        await stateManager.set(["Listings", key], entry);
      }
    });

    await t.step("StateManager returns the added listings", async () => {
      const { result, unmount } = renderHook(
        () => useStateManager({ db }),
        { wrapper: createWrapper(shopId) },
      );
      await waitFor(async () => {
        expect(result.current.data).toBeDefined();
        expect(result.current.data).toBeInstanceOf(StateManager);
        const listing = await stateManager.get(["Listings"]) as Map<
          number,
          unknown
        >;
        expect(listing?.size).toEqual(allListings?.size);
      });
      unmount();
    });
  }),
);
