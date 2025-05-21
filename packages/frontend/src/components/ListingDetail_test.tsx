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

  await screen.findByTestId("listing-detail-page");
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

  let successToast;
  let successToastText;
  const purchaseQty = await screen.findByTestId("purchaseQty");
  expect(purchaseQty).toBeTruthy();
  await user.clear(purchaseQty);
  await user.type(purchaseQty, `${initialQty}`);
  const addToCart = screen.getByTestId("addToCart");
  await user.click(addToCart);
  // wait for the success toast to appear
  successToast = await screen.findByTestId("success-toast");
  expect(successToast).toBeTruthy();
  // the success toast text should have its message begin with `${initialQty}`
  // first off: the toast text should begin with `${initialQty}` since initialQty > 1)
  successToastText = await screen.findByText(
    `${initialQty} items added`,
  );
  expect(successToastText.textContent?.startsWith(`${initialQty}`))
    .toBeTruthy();

  allOrders = await stateManager.get(["Orders"]) as Map<string, unknown>;
  expect(allOrders.size).toBe(1);

  const orderId = Array.from(allOrders.keys())[0];
  const orderData = await stateManager.get(["Orders", orderId]);
  expect(orderData).toBeDefined();

  const order = Order.fromCBOR(orderData!);
  expect(order.Items[0].ListingID).toBe(listingId);
  expect(order.Items[0].Quantity).toBe(initialQty);

  // Update quantity

  const purchaseQty2 = await screen.findByTestId("purchaseQty");
  expect(purchaseQty2).toBeTruthy();
  await user.clear(purchaseQty2);
  await user.type(purchaseQty2, `${qtyIncreasedBy}`);
  const addToCart2 = screen.getByTestId("addToCart");
  await user.click(addToCart2);
  // wait for the success toast to appear
  successToast = await screen.findByTestId("success-toast");
  expect(successToast).toBeTruthy();
  // now: its text should begin with `${qtyIncreasedBy}`
  successToastText = await screen.findByText(
    `${qtyIncreasedBy} items added`,
  );
  expect(successToastText.textContent?.startsWith(`${qtyIncreasedBy}`))
    .toBeTruthy();

  const d = await stateManager.get(["Orders", orderId]);
  expect(d).toBeDefined();
  const items = Order.fromCBOR(d!).Items;
  expect(items[0].ListingID).toBe(listingId);
  expect(items[0].Quantity).toBe(initialQty + qtyIncreasedBy);

  // Commit order and try to update quantity. Tests cancelAndRecreateOrder fn
  await stateManager.set(
    ["Orders", orderId, "State"],
    OrderState.Committed,
  );
  const purchaseQty3 = await screen.findByTestId("purchaseQty");
  expect(purchaseQty3).toBeTruthy();
  await user.clear(purchaseQty3);

  // Third quantity update
  await user.type(purchaseQty3, `${qtyIncreasedBy2}`);
  const addToCart3 = screen.getByTestId("addToCart");
  await user.click(addToCart3);
  // wait for the success toast to appear
  successToast = await screen.findByTestId("success-toast");
  expect(successToast).toBeTruthy();
  // finally: its text should begin with `${qtyIncreasedBy2}`
  successToastText = await screen.findByText(
    `${qtyIncreasedBy2} items added`,
  );
  expect(successToastText.textContent?.startsWith(`${qtyIncreasedBy2}`))
    .toBeTruthy();

  let updatedOrders;
  await waitFor(async () => {
    updatedOrders = await stateManager.get(["Orders"]) as Map<
      CodecKey,
      CodecValue
    >;
    expect(updatedOrders.size).toBe(2);
  });
  const orderIds = Array.from(updatedOrders!.keys()).filter((id) =>
    id !== orderId
  );
  expect(orderIds.length).toBe(1);
  const newOrderId = orderIds[0] as number;
  await waitFor(async () => {
    const newOrderData = await stateManager.get(["Orders", newOrderId]) as Map<
      CodecKey,
      CodecValue
    >;
    const newOrder = Order.fromCBOR(newOrderData);
    // Since quantity was updated 3 times, it should be the addition of the 3 quantities tested.
    const totalQuantity = initialQty + qtyIncreasedBy + qtyIncreasedBy2;
    expect(newOrder.Items[0].Quantity).toBe(totalQuantity);
  });

  unmount();

  cleanup();
});
