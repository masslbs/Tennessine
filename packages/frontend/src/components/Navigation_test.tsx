import "../happyDomSetup.ts";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";

import { allListings } from "@massmarket/schema/testFixtures";
import type { CodecValue } from "@massmarket/utils/codec";
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
    await merchantStateManager.set(["Listings", listingID], listing);
    await merchantStateManager.set(["Inventory", listingID], 100);
  }

  // remove merchant's keycard to free up for customer
  localStorage.removeItem(`keycard${shopId}`);

  const { wrapper, stateManager, relayClient, testAccount } =
    await createRouterWrapper({
      shopId,
    });
  await relayClient.enrollKeycard(testClient, testAccount, true);
  stateManager.addConnection(relayClient);

  await waitFor(async () => {
    const storedListings = await stateManager.get(["Listings"]) as Map<
      bigint,
      unknown
    >;
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
  await stateManager.set(["Orders", orderId], order);

  const { unmount } = render(<Navigation />, { wrapper });
  await screen.findByTestId("navigation");

  const user = userEvent.setup();
  await waitFor(async () => {
    const cartToggle = screen.getByTestId("cart-toggle");
    expect(cartToggle).toBeDefined();
    await user.click(cartToggle);
  });

  await t.step("Remove item from cart", async () => {
    // Check that the cart items are rendered
    const desktopCart = screen.getByTestId("desktop-cart");

    await waitFor(() => {
      expect(desktopCart).toBeDefined();
      const cartItems = within(desktopCart).getAllByTestId("cart-item");
      expect(cartItems.length).toBe(2);
      //check that the added quantity is displayed correctly
      expect(cartItems[0].textContent).toEqual(
        "test32Qty: 320.00000000000736ETH",
      );
      expect(cartItems[1].textContent).toEqual(
        "test4224Qty: 240.00000000001008ETH",
      );
    });

    await waitFor(async () => {
      const removeButton = within(desktopCart).getByTestId(
        `remove-item-${item1ID}`,
      );
      expect(removeButton).toBeDefined();
      await user.click(removeButton);
    });

    await waitFor(() => {
      const cartItems = within(desktopCart).getAllByTestId("cart-item");
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].textContent).toContain("test4224Qty");
    });
  });

  await t.step("Add quantity to item", async () => {
    const desktopCart = screen.getByTestId("desktop-cart");

    await waitFor(async () => {
      const addButton = within(desktopCart).getByTestId(
        `add-quantity-${item2ID}`,
      );
      expect(addButton).toBeDefined();
      await user.click(addButton);
    });
    await waitFor(() => {
      const quantity = within(desktopCart).getByTestId(`quantity-${item2ID}`);
      expect(quantity.textContent).toContain("25");
    });
    // Check statemanager updated correctly.
    const updatedOrder = await stateManager.get(["Orders", orderId]);
    expect(updatedOrder).toBeDefined();
    const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
    expect(updatedOrderItems[0].ListingID).toBe(item2ID);
    expect(updatedOrderItems[0].Quantity).toBe(25);
  });

  await t.step("Remove quantity from item", async () => {
    const desktopCart = screen.getByTestId("desktop-cart");

    await waitFor(async () => {
      const minusQty = within(desktopCart).getByTestId(
        `remove-quantity-${item2ID}`,
      );
      expect(minusQty).toBeDefined();
      await user.click(minusQty);
    });
    await waitFor(() => {
      const quantity = within(desktopCart).getByTestId(`quantity-${item2ID}`);
      expect(quantity.textContent).toContain("24");
    });
    // Check statemanager updated correctly.
    const updatedOrder = await stateManager.get(["Orders", orderId]);
    expect(updatedOrder).toBeDefined();
    const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
    expect(updatedOrderItems[0].ListingID).toBe(item2ID);
    expect(updatedOrderItems[0].Quantity).toBe(24);
  });

  await t.step("Clear cart", async () => {
    const desktopCart = screen.getByTestId("desktop-cart");

    await waitFor(async () => {
      const clearCart = within(desktopCart).getByTestId("clear-cart");
      await user.click(clearCart);
    });
    await waitFor(() => {
      const cartItems = within(desktopCart).queryAllByTestId("cart-item");
      expect(cartItems.length).toBe(0);
    });
    const updatedOrder = await stateManager.get(["Orders", orderId]);
    expect(updatedOrder).toBeDefined();
    const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
    expect(updatedOrderItems.length).toBe(0);
  });

  await t.step("Checkout button", async () => {
    await stateManager.set(["Orders", orderId, "Items"], [
      new OrderedItem(item1ID, 32).asCBORMap(),
      new OrderedItem(item2ID, 24).asCBORMap(),
    ]);

    await waitFor(async () => {
      const cartToggle = screen.getByTestId("cart-toggle");
      expect(cartToggle).toBeTruthy();
      await user.click(cartToggle);
    });
    const desktopCart = screen.getByTestId("desktop-cart");

    await waitFor(async () => {
      const checkoutButton = within(desktopCart).getByTestId(
        "checkout-button",
      );
      expect(checkoutButton).toBeDefined();
      await user.click(checkoutButton);
    });
    //Check that the order was committed after clicking checkout button.
    const updatedOrder = await stateManager.get(["Orders", orderId]);
    expect(updatedOrder).toBeDefined();
    const state = Order.fromCBOR(updatedOrder!).State;
    expect(state).toBe(OrderState.Committed);
  });

  await t.step("clear cart when order is committed", async () => {
    await waitFor(async () => {
      const cartToggle = screen.getByTestId("cart-toggle");
      expect(cartToggle).toBeTruthy();
      await user.click(cartToggle);
    });
    const desktopCart = screen.getByTestId("desktop-cart");

    await waitFor(async () => {
      // Verify the cart header is displayed
      const cartHeader = within(desktopCart).getByText("Cart");
      expect(cartHeader).toBeTruthy();
      // Try to clear cart that's already committed
      const clearCart = within(desktopCart).getByTestId("clear-cart");
      expect(clearCart).toBeDefined();
      await user.click(clearCart);
    });
    await waitFor(async () => {
      const cartItems = within(desktopCart).queryAllByTestId("cart-item");
      expect(cartItems.length).toBe(0);
      const orders = await stateManager.get(["Orders"]) as Map<
        number,
        unknown
      >;
      //Clearing cart of an already committed order should cancel the order and recreate a new order with no items.
      expect(orders.size).toBe(2);
      const o = orders.get(orderId) as CodecValue;
      const order = Order.fromCBOR(o!);
      expect(order.CanceledAt).toBeDefined();
      expect(order.State).toBe(OrderState.Canceled);
    });
  });

  unmount();
  cleanup();
});
