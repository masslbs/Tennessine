import "../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";
import { allListings } from "@massmarket/schema/testFixtures";
import { random256BigInt, randUint64 } from "@massmarket/utils";
import { Order, OrderedItem } from "@massmarket/schema";
import Navigation from "./Navigation.tsx";
import {
  createRouterWrapper,
  createTestStateManager,
} from "../testutils/mod.tsx";
import { OrderState } from "../types.ts";

Deno.test("Check that we can render the navigation bar", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const shopId = random256BigInt();
  const stateManager = await createTestStateManager(shopId);

  // populate state manager with listings
  for (const [listingID, listing] of allListings.entries()) {
    // @ts-ignore TODO: add BaseClass to CodecValue
    await stateManager.set(["Listings", listingID], listing);
    await stateManager.set(["Inventory", listingID], 10);
  }

  // bring up wrapper, connect relay as a guest
  const { wrapper } = await createRouterWrapper({
    createShop: true,
    enrollMerchant: false,
    stateManager,
  });

  // Create order and add items to it
  const orderId = randUint64();
  const item1ID = 23;
  const item2ID = 42;
  const order = new Order(
    orderId,
    [
      new OrderedItem(item1ID, 2),
      new OrderedItem(item2ID, 5),
    ],
    OrderState.Open,
  );
  // @ts-ignore TODO: add BaseClass to CodecValue
  await stateManager.set(["Orders", orderId], order);

  const { unmount } = render(<Navigation />, { wrapper });
  screen.debug();
  screen.getByTestId("navigation");

  const user = userEvent.setup();
  await act(async () => {
    const cartToggle = screen.getByTestId("cart-toggle");
    expect(cartToggle).toBeTruthy();
    await user.click(cartToggle);
  });

  await t.step("Remove item from cart", async () => {
    // Check that the cart items are rendered
    await waitFor(() => {
      const cartItems = screen.getAllByTestId("cart-item");
      expect(cartItems.length).toBe(2);
      //check that the added quantity is displayed correctly
      expect(cartItems[0].textContent).toContain("2");
      expect(cartItems[1].textContent).toContain("5");
    });

    await act(async () => {
      const removeButton = screen.getByTestId(`remove-item-${item1ID}`);
      await user.click(removeButton);
    });

    await waitFor(() => {
      const cartItems = screen.getAllByTestId("cart-item");
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].textContent).toContain(metadata2.title);
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
