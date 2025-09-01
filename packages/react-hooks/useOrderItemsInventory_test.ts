import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { allListings } from "@massmarket/schema/testFixtures";
import { randUint64 } from "@massmarket/utils";
import { Order, OrderedItem, OrderPaymentState } from "@massmarket/schema";

import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";
import useOrderItemsInventory from "./useOrderItemsInventory.ts";

Deno.test(
  "useOrderItemsInventory",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);
    const listingId = 23;
    const listingId2 = 42;
    await t.step("Create listings and new open order", async () => {
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      for (const [key, entry] of allListings.entries()) {
        await stateManager.set(["Listings", key], entry);
        if (key === listingId) {
          await stateManager.set(["Inventory", key], 111);
        } else {
          await stateManager.set(["Inventory", key], 122);
        }
      }

      const orderId = randUint64();

      const newOrder = new Order(
        orderId,
        [
          new OrderedItem(listingId, 5),
          new OrderedItem(listingId2, 5),
        ],
        OrderPaymentState.Open,
      );
      await stateManager!.set(
        ["Orders", orderId],
        newOrder,
      );
    });

    await t.step("Test useOrderItemsInventory", async () => {
      const { result, unmount } = renderHook(() => useOrderItemsInventory(), {
        wrapper: createWrapper(shopId),
      });
      await waitFor(() => {
        expect(result.current.inventoryMap.size).toBe(2);
        expect(result.current.inventoryMap.get(listingId)).toBe(111);
        expect(result.current.inventoryMap.get(listingId2)).toBe(122);
      });
      // Fire inventory update events and verify the event listeners are set up correctly.
      await stateManager.set(["Inventory", listingId], 999);
      await stateManager.set(["Inventory", listingId2], 888);

      await waitFor(() => {
        expect(result.current.inventoryMap.get(listingId)).toBe(999);
        expect(result.current.inventoryMap.get(listingId2)).toBe(888);
      });
      unmount();
    });
  }),
);
