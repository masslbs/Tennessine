import "../happyDomSetup.ts";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";

import { random256BigInt } from "@massmarket/utils";
import { Listing, Order } from "@massmarket/schema";
import { allListings } from "@massmarket/schema/testFixtures";
import type { CodecKey, CodecValue } from "@massmarket/utils/codec";

import ListingDetail from "./ListingDetail.tsx";
import { createRouterWrapper, testClient } from "../testutils/mod.tsx";
import { formatUnits } from "viem";
import { OrderState } from "../types.ts";

Deno.test("Check that we can render the listing details screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const shopId = random256BigInt();

  const {
    stateManager: merchantStateManager,
    relayClient: merchantRelayClient,
  } = await createRouterWrapper({
    shopId,
    createShop: true,
    enrollMerchant: true,
  });
  merchantStateManager.addConnection(merchantRelayClient);
  let listing: Listing;
  const listingId = 23;
  if (!allListings.has(listingId)) {
    throw new Error(`Listing ${listingId} not found`);
  }
  for (const [key, entry] of allListings.entries()) {
    await merchantStateManager.set(["Listings", key], entry);
    if (key === listingId) {
      listing = entry as Listing;
    }
  }

  await merchantStateManager.set(["Inventory", listingId], 30);

  // Remove merchant's keycard to free up for customer
  localStorage.removeItem(`keycard${shopId}`);

  // Set up customer
  const { wrapper, stateManager, relayClient, testAccount } =
    await createRouterWrapper({
      shopId,
      path: `/?itemId=${listingId}`,
    });
  await relayClient.enrollKeycard(testClient, testAccount, true);
  await relayClient.connect();
  await relayClient.authenticate();
  stateManager.addConnection(relayClient);

  await waitFor(async () => {
    const storedListings = await stateManager.get(["Listings"]) as Map<
      number,
      unknown
    >;
    expect(storedListings.size).toBe(allListings.size);
  });
  const { unmount } = render(<ListingDetail />, { wrapper });

  screen.getByTestId("listing-detail-page");
  await waitFor(() => {
    const price = screen.getByTestId("price");
    expect(price.textContent).toBe(formatUnits(listing.Price, 18));
    const description = screen.getByTestId("description");
    expect(description.textContent).toBe(listing.Metadata.Description);
    const title = screen.getByTestId("title");
    expect(title.textContent).toBe(listing.Metadata.Title);
  });

  let allOrders = await stateManager.get(["Orders"]) as Map<string, unknown>;
  expect(allOrders.size).toBe(0);

  // Test adding to cart
  const user = userEvent.setup();

  // initial quantity chosen for item
  const initialQty = 2;
  // how much the quantity is increased with on the user's second pass
  const qtyIncreasedBy = 7;
  const qtyIncreasedBy2 = 3;

  await waitFor(async () => {
    const purchaseQty = screen.getByTestId("purchaseQty");
    expect(purchaseQty).toBeTruthy();
    await user.clear(purchaseQty);
    await user.type(purchaseQty, `${initialQty}`);
    const addToBasket = screen.getByTestId("addToBasket");
    await user.click(addToBasket);
  });

  allOrders = await stateManager.get(["Orders"]) as Map<string, unknown>;
  expect(allOrders.size).toBe(1);

  const orderId = Array.from(allOrders.keys())[0];
  const orderData = await stateManager.get(["Orders", orderId]);
  expect(orderData).toBeDefined();

  const order = Order.fromCBOR(orderData!);
  expect(order.Items[0].ListingID).toBe(listingId);
  expect(order.Items[0].Quantity).toBe(initialQty);

  // Update quantity
  await waitFor(async () => {
    const purchaseQty = screen.getByTestId("purchaseQty");
    expect(purchaseQty).toBeTruthy();
    await user.clear(purchaseQty);
    await user.type(purchaseQty, `${qtyIncreasedBy}`);
    const addToBasket = screen.getByTestId("addToBasket");
    await user.click(addToBasket);
  });

  await waitFor(async () => {
    const d = await stateManager.get(["Orders", orderId]);
    expect(d).toBeDefined();
    const items = Order.fromCBOR(d!).Items;
    expect(items[0].ListingID).toBe(listingId);
    expect(items[0].Quantity).toBe(initialQty + qtyIncreasedBy);
  });

  // Commit order and try to update quantity. Tests cancelAndRecreateOrder fn
  await stateManager.set(
    ["Orders", orderId, "State"],
    OrderState.Committed,
  );
  await waitFor(async () => {
    const purchaseQty = screen.getByTestId("purchaseQty");
    expect(purchaseQty).toBeTruthy();
    await user.clear(purchaseQty);
    // Third quantity update
    await user.type(purchaseQty, `${qtyIncreasedBy2}`);
    const addToBasket = screen.getByTestId("addToBasket");
    await user.click(addToBasket);
  });
  await waitFor(async () => {
    const successToast = screen.getByTestId("success-toast");
    expect(successToast).toBeTruthy();
    const updatedOrders = await stateManager.get(["Orders"]) as Map<
      CodecKey,
      CodecValue
    >;
    expect(updatedOrders.size).toBe(2);
    const newOrderId = Array.from(updatedOrders.keys())[1];
    const newOrderData = await stateManager.get(["Orders", newOrderId]) as Map<
      CodecKey,
      CodecValue
    >;
    const newOrder = Order.fromCBOR(newOrderData);
    expect(newOrder.Items[0].ListingID).toBe(listingId);
    // Since quantity was updated 3 times, it should be the addition of the 3 quantities tested.
    expect(newOrder.Items[0].Quantity).toBe(
      initialQty + qtyIncreasedBy + qtyIncreasedBy2,
    );
  }, { timeout: 10000 });

  unmount();

  cleanup();
});
