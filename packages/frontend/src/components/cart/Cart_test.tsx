import "../../happyDomSetup.ts";
import { useEffect, useState } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";

import { allListings } from "@massmarket/schema/testFixtures";
import { randUint64 } from "@massmarket/utils";
import { Order, OrderedItem } from "@massmarket/schema";
import { useStateManager } from "@massmarket/react-hooks";
import type { CodecValue } from "@massmarket/utils/codec";

import Cart from "./Cart.tsx";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "../../testutils/_createWrapper.tsx";
import { OrderState } from "../../types.ts";

const orderId = randUint64();
const committedOrderId = randUint64();
const committedOrderId2 = randUint64();
const listingID = 23;
const listingID2 = 42;

Deno.test(
  "Cart - Commit order",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const user = userEvent.setup();

    // Merchant setup
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);
    await relayClient.connect();
    await relayClient.authenticate();
    stateManager.addConnection(relayClient);

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

    await t.step(
      "Clicking checkout button should update order state to committed",
      async () => {
        const wrapper = await createWrapper(shopId);
        const { unmount } = render(<CartTest />, { wrapper });
        await waitFor(() => {
          const cartItems = screen.getAllByTestId("cart-item");
          expect(cartItems.length).toBe(2);
        });

        const checkoutButton = screen.getByTestId("checkout-button");
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
      },
    );

    await t.step("Changing items after order is committed", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<CommittedOrderComponent />, { wrapper });
      await waitFor(async () => {
        const cartScreen = screen.getByTestId("cart-screen");
        expect(cartScreen).toBeDefined();
        // +1 to listing 2
        const addButton = screen.getByTestId(
          `add-quantity-${listingID2}`,
        );
        expect(addButton).toBeDefined();
        await user.click(addButton);
      });

      await waitFor(() => {
        const quantity = screen.getByTestId(
          `quantity-${listingID2}`,
        );
        expect(quantity.textContent).toContain("25");
      });

      await waitFor(async () => {
        const orders = await stateManager.get(["Orders"]) as Map<
          number,
          unknown
        >;
        const o = orders.get(committedOrderId) as CodecValue;
        expect(o).toBeDefined();
        const order = Order.fromCBOR(o!);
        expect(order.CanceledAt).toBeDefined();
        expect(order.State).toBe(OrderState.Canceled);
        // The new order should have the same items as the committed order.
        const newOrder = Array.from(orders.values()).pop() as CodecValue;
        const newOrderItems = Order.fromCBOR(newOrder).Items;
        expect(newOrderItems).toHaveLength(2);
        expect(newOrderItems[1].ListingID).toBe(listingID2);
        expect(newOrderItems[1].Quantity).toBe(25);
      });
      unmount();
    });

    await t.step("Clearing cart of a committed order.", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<CommittedOrderComponent2 />, { wrapper });
      await waitFor(async () => {
        const cartScreen = screen.getByTestId("cart-screen");
        expect(cartScreen).toBeDefined();

        const clearCart = screen.getByTestId("clear-cart");
        expect(clearCart).toBeDefined();
        await user.click(clearCart);
      });

      await waitFor(async () => {
        const cartItems = screen.queryAllByTestId("cart-item");

        expect(cartItems.length).toBe(0);
        const orders = await stateManager.get(["Orders"]) as Map<
          number,
          unknown
        >;
        const o = orders.get(committedOrderId) as CodecValue;
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

const createTestComponent = (oId: number, commitOrder: boolean) => {
  return () => {
    const { stateManager } = useStateManager();
    const [listingsLoaded, setLoading] = useState<boolean>(
      false,
    );
    useEffect(() => {
      if (!stateManager) return;

      stateManager.get(["Listings"]).then(
        (listings: CodecValue | undefined) => {
          if (listings instanceof Map) {
            setLoading(!!listings.size);
          }
        },
      );
      stateManager.events.on((listings: CodecValue | undefined) => {
        if (listings instanceof Map) {
          setLoading(!!listings.size);
        }
      }, ["Listings"]);
    }, [stateManager]);

    useEffect(() => {
      if (!stateManager || !listingsLoaded) return;
      // Create order and add items
      const order = new Order(
        oId,
        [
          new OrderedItem(listingID, 32),
          new OrderedItem(listingID2, 24),
        ],
        OrderState.Open,
      );

      stateManager.set(["Orders", oId], order).then(() => {
        if (!commitOrder) return;
        stateManager.set(["Orders", oId, "State"], OrderState.Committed);
      });
    }, [listingsLoaded]);

    return <Cart />;
  };
};

const CartTest = createTestComponent(orderId, false);
const CommittedOrderComponent = createTestComponent(committedOrderId, true);
const CommittedOrderComponent2 = createTestComponent(committedOrderId2, true);
