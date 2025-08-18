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

const listingID = 23;
const listingID2 = 42;

Deno.test(
  "Cart",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    // Merchant setup
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);
    await relayClient.connect();
    await relayClient.authenticate();
    stateManager.addConnection(relayClient);

    await t.step("Add listings.", async () => {
      for (const [id, listing] of allListings.entries()) {
        if (id === listingID) {
          listing.Price = 300000000000000n;
        } else if (id === listingID2) {
          listing.Price = 700000000000000n;
        }
        await stateManager.set(["Listings", id], listing);
        await stateManager.set(["Inventory", id], 100);
      }

      await waitFor(async () => {
        const storedListings = await stateManager.get(["Listings"]) as Map<
          bigint,
          unknown
        >;
        expect(storedListings.size).toBe(allListings.size);
      });
    });

    //FIXME: This test fails in the CI, but passes locally.

    // await t.step("Out of stock error", async () => {
    //   const orderId = randUint64();

    //   const wrapper = createWrapper(shopId);
    //   const CartTest = createTestComponent(orderId, false);
    //   const { unmount } = render(<CartTest />, { wrapper });
    //   const user = userEvent.setup();

    //   const wantTotalPrice = "0.0635";

    //   await waitFor(() => {
    //     const titles = screen.getAllByTestId("listing-title");
    //     expect(titles).toHaveLength(2);
    //     expect(titles[0].textContent).toContain("test");
    //     expect(titles[1].textContent).toContain("test42");
    //     const selectedQty = screen.getAllByTestId("selected-qty");
    //     expect(selectedQty).toHaveLength(2);
    //     expect(selectedQty[0].textContent).toContain("200");
    //     expect(selectedQty[1].textContent).toContain("5");
    //     expect(screen.getByTestId("total-price").textContent).toBe(
    //       wantTotalPrice,
    //     );
    //   });

    //   const checkoutButton1 = screen.getByTestId("checkout-button");
    //   expect(checkoutButton1).toBeTruthy();
    //   await user.click(checkoutButton1);

    //   // Wait for the error message to appear after the error is caught and handled
    //   await waitFor(() => {
    //     const outOfStockMsg = screen.getByTestId("out-of-stock");
    //     expect(outOfStockMsg).toBeTruthy();
    //     expect(outOfStockMsg.textContent).toContain(
    //       `Please reduce quantity or remove from cart to proceed.`,
    //     );
    //   });

    //   // Remove item and try to checkout again
    //   const removeButton = screen.getByTestId("remove-item-23");
    //   expect(removeButton).toBeTruthy();
    //   await user.click(removeButton);
    //   const checkoutButton2 = screen.getByTestId("checkout-button");
    //   expect(checkoutButton2).toBeTruthy();
    //   await user.click(checkoutButton2);

    //   await waitFor(async () => {
    //     const orderData = await stateManager.get(["Orders", orderId]);
    //     const o = Order.fromCBOR(orderData!);
    //     expect(o.State).toBe(OrderState.Committed);
    //   });

    //   unmount();
    // });

    await t.step("Add/remove quantity from item", async () => {
      const orderId = randUint64();
      const wrapper = createWrapper(shopId);
      const CartTest = createTestComponent(orderId, false);
      const { unmount } = render(<CartTest />, { wrapper });
      const user = userEvent.setup();

      await waitFor(() => {
        const cartScreen = screen.getAllByTestId("cart-item");
        expect(cartScreen).toHaveLength(2);
      });
      // +1 to listing 1
      const addButton = await screen.findByTestId(
        `add-quantity-${listingID}`,
      );
      await user.click(addButton);

      await waitFor(() => {
        const quantity = screen.getByTestId(
          `quantity-${listingID}`,
        );
        expect(quantity.textContent).toContain("201");
      });
      // -1 from listing 2
      const minusQty = await screen.findByTestId(
        `remove-quantity-${listingID2}`,
      );
      await user.click(minusQty);
      await waitFor(() => {
        const quantity = screen.getByTestId(
          `quantity-${listingID2}`,
        );
        expect(quantity.textContent).toContain("4");
      });
      // Check statemanager updated correctly.
      await waitFor(async () => {
        const updatedOrder = await stateManager.get(["Orders", orderId]);
        expect(updatedOrder).toBeDefined();
        const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
        expect(updatedOrderItems[0].ListingID).toBe(listingID);
        expect(updatedOrderItems[0].Quantity).toBe(201);
        expect(updatedOrderItems[1].ListingID).toBe(listingID2);
        expect(updatedOrderItems[1].Quantity).toBe(4);
      });
      unmount();
    });

    await t.step("Clear cart", async () => {
      const orderId = randUint64();
      const wrapper = createWrapper(shopId);
      const CartTest = createTestComponent(orderId, false);
      const { unmount } = render(<CartTest />, { wrapper });
      const user = userEvent.setup();

      await waitFor(() => {
        const items = screen.getAllByTestId("cart-item");
        expect(items).toHaveLength(2);
      });
      const clearCart = await screen.findByTestId("clear-cart");
      await user.click(clearCart);

      await waitFor(() => {
        const cartItems = screen.queryAllByTestId("cart-item");
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

    //Committed order

    await t.step("Changing items after order is committed", async () => {
      const wrapper = createWrapper(shopId);
      const orderId = randUint64();
      const CartTest = createTestComponent(orderId, true);
      const { unmount } = render(<CartTest />, { wrapper });
      const user = userEvent.setup();

      await waitFor(() => {
        const cartScreen = screen.getAllByTestId("cart-item");
        expect(cartScreen).toHaveLength(2);
      });
      // +1 to listing 2
      const addButton = await screen.findByTestId(
        `add-quantity-${listingID2}`,
      );
      await user.click(addButton);

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
        expect(newOrderItems[1].Quantity).toBe(25);
      });
      unmount();
    });

    await t.step("Clearing cart of a committed order.", async () => {
      const wrapper = createWrapper(shopId);
      const orderId = randUint64();
      const CartTest = createTestComponent(orderId, true);
      const { unmount } = render(<CartTest />, { wrapper });
      const user = userEvent.setup();

      await waitFor(() => {
        const cartScreen = screen.getAllByTestId("cart-item");
        expect(cartScreen).toHaveLength(2);
      });

      const clearCart = await screen.findByTestId("clear-cart");
      await user.click(clearCart);
      await waitFor(() => {
        const cartItems = screen.queryAllByTestId("cart-item");
        expect(cartItems.length).toBe(0);
      });
      await waitFor(async () => {
        const orders = await stateManager.get(["Orders"]) as Map<
          number,
          unknown
        >;
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
      // Create order
      const order = new Order(
        oId,
        commitOrder
          ? [
            new OrderedItem(listingID, 32),
            new OrderedItem(listingID2, 24),
          ]
          : [new OrderedItem(listingID, 200), new OrderedItem(listingID2, 5)],
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
