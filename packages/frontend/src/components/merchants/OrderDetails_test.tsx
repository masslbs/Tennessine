import "../../happyDomSetup.ts";
import { cleanup, render, screen } from "@testing-library/react";
import { expect } from "@std/expect";

import { random256BigInt } from "@massmarket/utils";
import { allOrderListings, allOrders } from "@massmarket/schema/testFixtures";
import { Listing, Order } from "@massmarket/schema";

import OrderDetails from "./OrderDetails.tsx";
import { createRouterWrapper } from "../../testutils/mod.tsx";

Deno.test("Check that we can render the order details screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const shopId = random256BigInt();
  const orderId = allOrders.keys().next().value!;
  const order = allOrders.get(orderId) as Order;
  order.ShippingAddress = order.InvoiceAddress;

  const {
    wrapper,
    stateManager,
    relayClient,
  } = await createRouterWrapper({
    shopId,
    path: `/?orderId=${orderId}`,
    createShop: true,
    enrollMerchant: true,
  });
  stateManager.addConnection(relayClient);
  let listing: Listing;
  for (const [key, entry] of allOrderListings.entries()) {
    await stateManager.set(["Listings", key], entry);
    if (key === order.Items[0].ListingID) {
      listing = entry as Listing;
    }
  }
  await stateManager.set(["Orders", orderId], order);

  const { unmount } = render(<OrderDetails />, { wrapper });
  // screen.debug();
  await screen.findByTestId("order-details-page");

  const orderItem = await screen.findAllByTestId("order-item");
  expect(orderItem.length).toBe(2);
  expect(orderItem[0].textContent).toContain(`${listing!.Metadata.Title}`);
  const details = await screen.findByTestId("shipping-details");
  expect(details).toBeTruthy();
  expect(details.textContent).toContain(order.ShippingAddress!.Name);
  expect(details.textContent).toContain(order.ShippingAddress!.Address1);
  expect(details.textContent).toContain(order.ShippingAddress!.City);
  expect(details.textContent).toContain(order.ShippingAddress!.Country);
  expect(details.textContent).toContain(order.ShippingAddress!.PostalCode);
  unmount();
  cleanup();
});
