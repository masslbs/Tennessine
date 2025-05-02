import "../../happyDomSetup.ts";

import { render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { random256BigInt } from "@massmarket/utils";
import { allOrderListings, allOrders } from "@massmarket/schema/testFixtures";

import MerchantDashboard from "./MerchantDashboard.tsx";
import { createRouterWrapper, testClient } from "../../testutils/mod.tsx";

Deno.test("Merchant Dashboard", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const shopId = random256BigInt();
  // Setting up merchant
  const {
    wrapper: merchantWrapper,
    stateManager: merchantStateManager,
    relayClient: merchantRelayClient,
  } = await createRouterWrapper({
    shopId,
    createShop: true,
    enrollMerchant: true,
  });
  merchantStateManager.addConnection(merchantRelayClient);

  //Add listings to shop
  for (const [key, entry] of allOrderListings.entries()) {
    await merchantStateManager.set(["Listings", key], entry);
  }

  localStorage.removeItem(`keycard${shopId}`);

  const { stateManager, relayClient, testAccount } = await createRouterWrapper({
    shopId,
  });

  //Setting up customer
  await relayClient.enrollKeycard(testClient, testAccount, true);
  await relayClient.connect();
  await relayClient.authenticate();
  stateManager.addConnection(relayClient);
  let orderId: number;

  for (const [key, entry] of allOrders.entries()) {
    await stateManager.set(["Orders", key], entry);
    orderId = key;
  }
  localStorage.removeItem(`keycard${shopId}`);


  const { unmount } = render(<MerchantDashboard />, {
    wrapper: merchantWrapper,
  });

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
