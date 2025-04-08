import "../happyDomSetup.ts";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";

import { random256BigInt } from "@massmarket/utils";
import { Listing, Order } from "@massmarket/schema";
import { allListings } from "@massmarket/schema/testFixtures";

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
    // @ts-ignore TODO: add BaseClass to CodecValue
    await merchantStateManager.set(["Listings", key], entry);
    if (key === listingId) {
      listing = entry as Listing;
    }
  }

  await merchantStateManager.set(["Inventory", listingId], 10);

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
  await waitFor(async () => {
    const purchaseQty = screen.getByTestId("purchaseQty");
    expect(purchaseQty).toBeTruthy();
    await user.type(purchaseQty, "5");
    const addToBasket = screen.getByTestId("addToBasket");
    await user.click(addToBasket);
  });

  allOrders = await stateManager.get(["Orders"]) as Map<string, unknown>;
  expect(allOrders.size).toBe(1);

  const orderId = Array.from(allOrders.keys())[0];
  const orderData = await stateManager.get(["Orders", orderId]);
  const order = Order.fromCBOR(orderData as Map<string, unknown>);
  expect(order.Items[0].ListingID).toBe(listingId);
  expect(order.Items[0].Quantity).toBe(5);

  // Update quantity
  await waitFor(async () => {
    const purchaseQty = screen.getByTestId("purchaseQty");
    expect(purchaseQty).toBeTruthy();
    await user.clear(purchaseQty);
    await user.type(purchaseQty, "10");
    const addToBasket = screen.getByTestId("addToBasket");
    await user.click(addToBasket);
  });
  const items =
    Order.fromCBOR(await stateManager.get(["Orders", orderId])).Items;
  expect(items[0].ListingID).toBe(listingId);
  expect(items[0].Quantity).toBe(10);

  // Commit order and try to update quantity. Tests cancelAndRecreateOrder fn
  await stateManager.set(
    ["Orders", orderId, "State"],
    OrderState.Committed,
  );
  await waitFor(async () => {
    const purchaseQty = screen.getByTestId("purchaseQty");
    expect(purchaseQty).toBeTruthy();
    await user.clear(purchaseQty);
    await user.type(purchaseQty, "1");
    const addToBasket = screen.getByTestId("addToBasket");
    await user.click(addToBasket);
  });
  await waitFor(async () => {
    const successToast = screen.getByTestId("success-toast");
    expect(successToast).toBeTruthy();
    const updatedOrders = await stateManager.get(["Orders"]);
    expect(updatedOrders.size).toBe(2);
    const newOrderId = Array.from(updatedOrders.keys())[1];
    const newOrderData = await stateManager.get(["Orders", newOrderId]);
    const newOrder = Order.fromCBOR(newOrderData as Map<string, unknown>);
    expect(newOrder.Items[0].ListingID).toBe(listingId);
    expect(newOrder.Items[0].Quantity).toBe(10);
  });

  unmount();

  cleanup();
});
