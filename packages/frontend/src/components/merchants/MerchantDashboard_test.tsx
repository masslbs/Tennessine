import "../../happyDomSetup.ts";

import { render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { random256BigInt } from "@massmarket/utils";
import { allOrderListings, allOrders } from "@massmarket/schema/testFixtures";

import MerchantDashboard from "./MerchantDashboard.tsx";
import { createRouterWrapper } from "../../testutils/mod.tsx";

Deno.test("Merchant Dashboard", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const shopId = random256BigInt();

  await t.step("All orders render", async () => {
    const {
      wrapper,
      stateManager,
      relayClient,
    } = await createRouterWrapper({
      shopId,
      createShop: true,
      enrollMerchant: true,
    });
    stateManager.addConnection(relayClient);

    for (const [key, entry] of allOrderListings.entries()) {
      await stateManager.set(["Listings", key], entry);
    }
    let orderId: number;
    for (const [key, entry] of allOrders.entries()) {
      await stateManager.set(["Orders", key], entry);
      orderId = key;
    }

    const { unmount } = render(<MerchantDashboard />, { wrapper });

    await waitFor(async () => {
      const orders = await screen.findAllByTestId("transaction");
      expect(orders).toBeTruthy();
      expect(orders.length).toBe(allOrders.size);
      const order = screen.getAllByTestId(orderId!);
      expect(order).toBeTruthy();
      const status = screen.getAllByTestId("status");
      expect(status[0].textContent).toBe("Open");
    });
    unmount();
  });
});
