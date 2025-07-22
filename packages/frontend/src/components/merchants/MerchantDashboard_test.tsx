import "../../happyDomSetup.ts";

import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { expect } from "@std/expect";

import { allOrderListings, allOrders } from "@massmarket/schema/testFixtures";
import { useKeycard } from "@massmarket/react-hooks";

import MerchantDashboard from "./MerchantDashboard.tsx";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testAccount,
  testClient,
  testWrapper,
} from "../../testutils/_createWrapper.tsx";

Deno.test(
  "Merchant Dashboard",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const openOrderId = 666;
    const committedOrderId = 667;

    await t.step("Add listings to shop.", async () => {
      const relayClient = await createTestRelayClient(shopId);
      const stateManager = await createTestStateManager(shopId);
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      //Add listings to shop
      for (const [key, entry] of allOrderListings.entries()) {
        await stateManager.set(["Listings", key], entry);
      }
    });

    await t.step("Add order to shop.", async () => {
      //Setting up customer
      const relayClient = await createTestRelayClient(shopId);
      const stateManager = await createTestStateManager(shopId);
      await relayClient.enrollKeycard(testClient, testAccount, true);
      stateManager.addConnection(relayClient);

      for (const [key, entry] of allOrders.entries()) {
        await stateManager.set(["Orders", key], entry);
      }
    });

    await t.step("Check if the merchant dashboard is rendered", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<TestComponent />, {
        wrapper,
      });
      await waitFor(async () => {
        const orders = await screen.findAllByTestId("transaction");
        expect(orders).toBeTruthy();
        expect(orders.length).toBe(allOrders.size);
        const open = screen.getAllByTestId(openOrderId);
        expect(open).toBeTruthy();
        const committed = screen.getAllByTestId(committedOrderId);
        expect(committed).toBeTruthy();
        expect(within(open[0]).getByTestId("status").textContent).toBe("Open");
        expect(within(committed[0]).getByTestId("status").textContent).toBe(
          "Committed",
        );
      });
      unmount();
    });
    cleanup();
  }),
);

const TestComponent = () => {
  useKeycard({ role: "merchant" });
  return <MerchantDashboard />;
};
