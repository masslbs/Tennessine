import "../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";
import { allListings } from "@massmarket/schema/testFixtures";
import { random256BigInt, randUint64 } from "@massmarket/utils";
import { Order, OrderedItem } from "@massmarket/schema";
import Navigation from "./Navigation.tsx";
import { createRouterWrapper, testClient } from "../testutils/mod.tsx";
import { OrderState } from "../types.ts";

Deno.test("Check that we can render the navigation bar", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
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

  // populate state manager with listings
  for (const [listingID, listing] of allListings.entries()) {
    // @ts-ignore TODO: add BaseClass to CodecValue
    await merchantStateManager.set(["Listings", listingID], listing);
    await merchantStateManager.set(["Inventory", listingID], 100);
  }

  // remove merchant's keycard to free up for customer
  localStorage.removeItem(`keycard${shopId}`);

  console.log("merchant setup done. bringing up customer wrapper.");

  const { wrapper, stateManager, relayClient, testAccount } =
    await createRouterWrapper({
      shopId,
    });
  await relayClient.enrollKeycard(testClient, testAccount, true);
  stateManager.addConnection(relayClient);

  await waitFor(async () => {
    const storedListings = await stateManager.get(["Listings"]);
    expect(storedListings.size).toBe(allListings.size);
  });

  // Create order and add items to it
  const orderId = randUint64();
  const item1ID = 23;
  const item2ID = 42;
  const order = new Order(
    orderId,
    [
      new OrderedItem(item1ID, 32),
      new OrderedItem(item2ID, 24),
    ],
    OrderState.Open,
  );
  // @ts-ignore TODO: add BaseClass to CodecValue
  await stateManager.set(["Orders", orderId], order);

  const { unmount } = render(<Navigation />, { wrapper });
  screen.getByTestId("navigation");

  const user = userEvent.setup();
  await act(async () => {
    const cartToggle = screen.getByTestId("cart-toggle");
    expect(cartToggle).toBeDefined();
    await user.click(cartToggle);
  });

  await t.step("Remove item from cart", async () => {
    // Check that the cart items are rendered
    await waitFor(() => {
      const cartItems = screen.getAllByTestId("cart-item");
      expect(cartItems.length).toBe(2);
      //check that the added quantity is displayed correctly
      expect(cartItems[0].textContent).toEqual("test32Qty: 327360000ETH");
      expect(cartItems[1].textContent).toEqual("test4224Qty: 2410080000ETH");
    });

    await act(async () => {
      const removeButton = screen.getByTestId(`remove-item-${item1ID}`);
      expect(removeButton).toBeDefined();
      await user.click(removeButton);
    });

    await waitFor(() => {
      const cartItems = screen.getAllByTestId("cart-item");
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].textContent).toContain("test4224Qty");
    });
  });
  /*
  await t.step("Add quantity to item", async () => {
    await act(async () => {
      const addButton = screen.getByTestId(`add-quantity-${item2ID}`);
      await user.click(addButton);
    });
    await waitFor(() => {
      const quantity = screen.getByTestId(`quantity-${item2ID}`);
      expect(quantity.textContent).toContain("6");
    });
  });

  await t.step("Remove quantity from item", async () => {
    await act(async () => {
      const minusQty = screen.getByTestId(`remove-quantity-${item2ID}`);
      await user.click(minusQty);
      await user.click(minusQty);
    });
    await waitFor(() => {
      const quantity = screen.getByTestId(`quantity-${item2ID}`);
      expect(quantity.textContent).toContain("4");
    });
    // Check statemanager updated correctly.
    const updatedOrder = Order.fromCBOR(await stateManager.get(["Orders", orderId]) as Map<string, unknown>);
    expect(updatedOrder.Items[0].ListingID).toBe(item1ID);
    expect(updatedOrder.Items[0].Quantity).toBe(4);
    expect(updatedOrder.Items[1].ListingID).toBe(item2ID);
    expect(updatedOrder.Items[1].Quantity).toBe(0);
  });

  await t.step("Clear cart", async () => {
    await act(async () => {
      const clearCart = screen.getByTestId("clear-cart");
      await user.click(clearCart);
    });
    await waitFor(() => {
      const cartItems = screen.queryAllByTestId("cart-item");
      expect(cartItems.length).toBe(0);
    });
    const updatedOrder = await stateManager.orders.get(order.id);
    expect(updatedOrder.items[item2.id]).toBe(0);
    expect(updatedOrder.items[item1.id]).toBe(0);
  });
  await t.step("Checkout button", async () => {
    await stateManager.orders.addItems(order.id, [{
      listingId: item1.id,
      quantity: 1,
    }, { listingId: item2.id, quantity: 1 }]);
    await act(async () => {
      const cartToggle = screen.getByTestId("cart-toggle");
      expect(cartToggle).toBeTruthy();
      await user.click(cartToggle);
    });
    await act(async () => {
      const checkoutButton = screen.getByTestId("checkout-button");
      await user.click(checkoutButton);
    });
    //Check that the order was committed after clicking checkout button.
    const updatedOrder = await stateManager.orders.get(order.id);
    expect(updatedOrder.status).toBe(OrderState.Committed);
  });
  */
  unmount();
  cleanup();
});
