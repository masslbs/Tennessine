import "../happyDomSetup.ts";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";

import { random256BigInt } from "@massmarket/utils";
import { Listing, Order } from "@massmarket/schema";
import { allListings } from "@massmarket/schema/testFixtures";

import ListingDetail from "./ListingDetail.tsx";
import {
  createRouterWrapper,
  createTestStateManager,
} from "../testutils/mod.tsx";

Deno.test("Check that we can render the listing details screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const shopId = random256BigInt();
  const stateManager = await createTestStateManager(shopId);

  let listing: Listing;
  const listingId = 23;
  if (!allListings.has(listingId)) {
    throw new Error(`Listing ${listingId} not found`);
  }
  for (const [key, entry] of allListings.entries()) {
    // @ts-ignore TODO: add BaseClass to CodecValue
    await stateManager.set(["Listings", key], entry);
    if (key === listingId) {
      listing = entry as Listing;
    }
  }

  const { wrapper } = await createRouterWrapper({
    shopId,
    createShop: true,
    enrollMerchant: false,
    path: `/?itemId=${listingId}`,
    stateManager,
  });
  const { unmount } = render(<ListingDetail />, { wrapper });
  // screen.debug();
  screen.getByTestId("listing-detail-page");
  await waitFor(() => {
    const price = screen.getByTestId("price");
    expect(price.textContent).toBe("12345");
    const description = screen.getByTestId("description");
    expect(description.textContent).toBe(listing.Metadata.Description);
    const title = screen.getByTestId("title");
    expect(title.textContent).toBe(listing.Metadata.Title);
  });

  let allOrders = await stateManager.get(["Orders"]) as Map<string, unknown>;
  expect(allOrders.size).toBe(0);

  // Test adding to cart
  const user = userEvent.setup();
  await waitFor(async () => {
    const purchaseQty = screen.getByTestId("purchaseQty");
    expect(purchaseQty).toBeTruthy();
    await user.type(purchaseQty, "2");
    const addToBasket = screen.getByTestId("addToBasket");
    await user.click(addToBasket);
  });

  allOrders = await stateManager.get(["Orders"]) as Map<string, unknown>;
  expect(allOrders.size).toBe(1);

  const orderId = Array.from(allOrders.keys())[0];
  const orderData = await stateManager.get(["Orders", orderId]);
  const order = Order.fromCBOR(orderData as Map<string, unknown>);
  expect(order.Items[0].ListingID).toBe(listingId);
  expect(order.Items[0].Quantity).toBe(2);

  unmount();
  cleanup();
});
