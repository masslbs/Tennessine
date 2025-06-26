import { render, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { useEffect } from "react";

import { allListings } from "@massmarket/schema/testFixtures";
import { randUint64 } from "@massmarket/utils";
import { Order, OrderedItem, OrderState } from "@massmarket/schema";

import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";
import { useActiveOrder } from "./useActiveOrder.ts";
import { useStateManager } from "./useStateManager.ts";

const orderId = randUint64();
const orderId2 = randUint64();

// This test creates listings, then creates multiple orders as a guest, and tests that the useActiveOrder hook returns the most recent order created.
Deno.test(
  "useActiveOrder",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);

    await t.step("Create listings", async () => {
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      for (const [key, entry] of allListings.entries()) {
        console.log("key", key);
        await stateManager.set(["Listings", key], entry);
        await stateManager.set(["Inventory", key], 100);
      }
    });

    await t.step("Test that the hook returns the last order", async () => {
      const rendered = render(<TestComponent />, {
        wrapper: createWrapper(shopId),
      });
      //Test that the hook returns orderID2, since that is the most recent order created.
      await waitFor(() => {
        expect(rendered.getByTestId("active-order").textContent).toBe(
          orderId2.toString(),
        );
      });
    });
  }),
);

const TestComponent = () => {
  const { stateManager } = useStateManager();
  const { activeOrder } = useActiveOrder();

  useEffect(() => {
    if (!stateManager) return;
    const order = new Order(
      orderId,
      [
        new OrderedItem(23, 7), // 200 of item 23
        new OrderedItem(42, 5), // 5 of item 42
      ],
      OrderState.Open,
    );
    const order2 = new Order(
      orderId2,
      [
        new OrderedItem(23, 5), // 200 of item 23
        new OrderedItem(42, 5), // 5 of item 42
      ],
      OrderState.Open,
    );
    stateManager.set(["Orders", orderId], order).then(() => {
      stateManager.set(["Orders", orderId2], order2).then();
    });
  }, [stateManager]);
  return <div data-testid="active-order">{activeOrder?.ID}</div>;
};
