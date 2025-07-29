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
import { randUint64 } from "@massmarket/utils";
import { Order, OrderedItem } from "@massmarket/schema";

import Navigation from "./Navigation.tsx";
import { OrderState } from "../types.ts";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "../testutils/_createWrapper.tsx";

Deno.test(
  "Navigation",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const user = userEvent.setup();
    const orderId = randUint64();
    const listingID = 23;
    const listingID2 = 42;

    // Merchant setup
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);
    await relayClient.connect();
    await relayClient.authenticate();
    stateManager.addConnection(relayClient);

    // Customer setup
    const customerRelayClient = await createTestRelayClient(shopId, true);
    const customerStateManager = await createTestStateManager(shopId);
    customerStateManager.addConnection(customerRelayClient);

    await t.step("Add listings.", async () => {
      for (const [listingID, listing] of allListings.entries()) {
        await stateManager.set(["Listings", listingID], listing);
        await stateManager.set(["Inventory", listingID], 100);
      }

      await waitFor(async () => {
        const storedListings = await stateManager.get(["Listings"]) as Map<
          bigint,
          unknown
        >;
        expect(storedListings.size).toBe(allListings.size);
      });
    });

    await t.step("Add order as customer.", async () => {
      const order = new Order(
        orderId,
        [
          new OrderedItem(listingID, 32),
          new OrderedItem(listingID2, 24),
        ],
        OrderState.Open,
      );
      await customerStateManager.set(["Orders", orderId], order);
    });

    await t.step("Add/remove quantity from item", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<Navigation />, { wrapper });

      const cartScreen = screen.getByTestId("cart");
      // +1 to listing 1
      await waitFor(async () => {
        const addButton = within(cartScreen).getByTestId(
          `add-quantity-${listingID}`,
        );
        expect(addButton).toBeDefined();
        await user.click(addButton);
      });
      await waitFor(() => {
        const quantity = within(cartScreen).getByTestId(
          `quantity-${listingID}`,
        );
        expect(quantity.textContent).toContain("33");
      });
      // -1 from listing 2
      await waitFor(async () => {
        const minusQty = within(cartScreen).getByTestId(
          `remove-quantity-${listingID2}`,
        );
        expect(minusQty).toBeDefined();
        await user.click(minusQty);
      });
      await waitFor(() => {
        const quantity = within(cartScreen).getByTestId(
          `quantity-${listingID2}`,
        );
        expect(quantity.textContent).toContain("23");
      });
      // Check statemanager updated correctly.
      await waitFor(async () => {
        const updatedOrder = await stateManager.get(["Orders", orderId]);
        expect(updatedOrder).toBeDefined();
        const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
        expect(updatedOrderItems[0].ListingID).toBe(listingID);
        expect(updatedOrderItems[0].Quantity).toBe(33);
        expect(updatedOrderItems[1].ListingID).toBe(listingID2);
        expect(updatedOrderItems[1].Quantity).toBe(23);
      });

      unmount();
    });

    await t.step("Remove item from cart", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<Navigation />, { wrapper });

      await screen.findByTestId("navigation");
      await waitFor(async () => {
        const cartToggle = screen.getByTestId("cart-toggle");
        expect(cartToggle).toBeDefined();
        await user.click(cartToggle);
      });

      // Check that the cart items are rendered
      const cartScreen = screen.getByTestId("cart");

      await waitFor(() => {
        expect(cartScreen).toBeDefined();
        const titles = screen.getAllByTestId("listing-title");
        expect(titles).toHaveLength(2);
        expect(titles[0].textContent).toContain("test");
        expect(titles[1].textContent).toContain("test42");
        const selectedQty = screen.getAllByTestId("selected-qty");
        expect(selectedQty).toHaveLength(2);
        expect(selectedQty[0].textContent).toContain("33");
        expect(selectedQty[1].textContent).toContain("23");
      });

      await waitFor(async () => {
        const removeButton = within(cartScreen).getByTestId(
          `remove-item-${listingID}`,
        );
        expect(removeButton).toBeDefined();
        await user.click(removeButton);
      });

      await waitFor(() => {
        const listings = screen.getAllByTestId("cart-item");
        expect(listings).toHaveLength(1);
        const title = screen.getByTestId("listing-title");
        expect(title.textContent).toContain("test42");
      });

      // Check that the item was removed from the order.
      await waitFor(async () => {
        const updatedOrder = await stateManager.get(["Orders", orderId]);
        expect(updatedOrder).toBeDefined();
        const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
        expect(updatedOrderItems).toHaveLength(1);
        expect(updatedOrderItems[0].ListingID).toBe(listingID2);
      });

      // Clear cart
      const clearCart = within(cartScreen).getByTestId("clear-cart");
      await user.click(clearCart);

      await waitFor(() => {
        const cartItems = within(cartScreen).queryAllByTestId("cart-item");
        expect(cartItems.length).toBe(0);
      });
      await waitFor(async () => {
        const updatedOrder = await stateManager.get(["Orders", orderId]);
        expect(updatedOrder).toBeDefined();
        const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
        expect(updatedOrderItems.length).toBe(0);
      });
      unmount();
    });

    await t.step("Checkout button", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<Navigation />, { wrapper });
      // Add back the listings to order.
      await customerStateManager.set(["Orders", orderId, "Items"], [
        new OrderedItem(listingID, 32).asCBORMap(),
        new OrderedItem(listingID2, 20).asCBORMap(),
      ]);

      const cartToggle = screen.getByTestId("cart-toggle");
      expect(cartToggle).toBeTruthy();
      await user.click(cartToggle);

      await waitFor(() => {
        const cartItems = screen.getAllByTestId("cart-item");
        expect(cartItems.length).toBe(2);
      });

      const cartScreen = screen.getByTestId("cart");
      const checkoutButton = within(cartScreen).getByTestId(
        "checkout-button",
      );
      expect(checkoutButton).toBeDefined();

      await user.click(checkoutButton);

      await waitFor(async () => {
        // Check that the order was committed after clicking checkout button.
        const updatedOrder = await stateManager.get(["Orders", orderId]);
        expect(updatedOrder).toBeDefined();
        const state = Order.fromCBOR(updatedOrder!).State;
        expect(state).toBe(OrderState.Committed);
      });
      unmount();
    });

    await t.step("Changing items after order is committed", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<Navigation />, { wrapper });

      const cartToggle = screen.getByTestId("cart-toggle");
      expect(cartToggle).toBeTruthy();
      await user.click(cartToggle);

      const cartScreen = screen.getByTestId("cart");
      // +1 to listing 2
      await waitFor(async () => {
        const addButton = within(cartScreen).getByTestId(
          `add-quantity-${listingID2}`,
        );
        expect(addButton).toBeDefined();
        await user.click(addButton);
      });
      await waitFor(() => {
        const quantity = within(cartScreen).getByTestId(
          `quantity-${listingID2}`,
        );
        expect(quantity.textContent).toContain("21");
      });

      await waitFor(async () => {
        const orders = await stateManager.get(["Orders"]) as Map<
          number,
          unknown
        >;
        const o = orders.get(orderId) as CodecValue;
        expect(o).toBeDefined();
        const order = Order.fromCBOR(o!);
        expect(order.CanceledAt).toBeDefined();
        expect(order.State).toBe(OrderState.Canceled);
        // The new order should have the same items as the committed order.
        const newOrder = Array.from(orders.values()).pop() as CodecValue;
        const newOrderItems = Order.fromCBOR(newOrder).Items;
        expect(newOrderItems).toHaveLength(2);
        expect(newOrderItems[1].ListingID).toBe(listingID2);
        expect(newOrderItems[1].Quantity).toBe(21);
      });

      // Clearing cart of a committed order should cancel the order and recreate a new order with no items.
      const clearCart = within(cartScreen).getByTestId("clear-cart");
      expect(clearCart).toBeDefined();
      await user.click(clearCart);

      await waitFor(async () => {
        const cartItems = within(cartScreen).queryAllByTestId("cart-item");
        expect(cartItems.length).toBe(0);
        const orders = await stateManager.get(["Orders"]) as Map<
          number,
          unknown
        >;
        expect(orders.size).toBe(2);
        const o = orders.get(orderId) as CodecValue;
        const order = Order.fromCBOR(o!);
        expect(order.CanceledAt).toBeDefined();
        expect(order.State).toBe(OrderState.Canceled);
        // The new order should have no items.
        const newOrder = Array.from(orders.values()).pop() as CodecValue;
        const newOrderItems = Order.fromCBOR(newOrder).Items;
        expect(newOrderItems).toHaveLength(0);
      });
      unmount();
    });

    cleanup();
  }),
);
