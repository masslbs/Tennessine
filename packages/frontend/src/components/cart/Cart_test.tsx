import "../../happyDomSetup.ts";
import { useEffect, useState } from "react";
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
import { OrderPaymentState } from "../../types.ts";

const listingID = 23;
const listingID2 = 42;
const listingID3 = 666;

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
        console.log("ID!!", id);
        if (id === listingID) {
          listing.Price = 300000000000000n;
        } else {
          listing.Price = 700000000000000n;
        }
        await stateManager.set(["Listings", id], listing);
        if (id === listingID2) {
          await stateManager.set(["Inventory", id], 4);
        } else {
          await stateManager.set(["Inventory", id], 100);
        }
      }

      await waitFor(async () => {
        const storedListings = await stateManager.get(["Listings"]) as Map<
          bigint,
          unknown
        >;
        expect(storedListings.size).toBe(allListings.size);
      });
    });

    await t.step("Add/remove quantity from item", async () => {
      const orderId = randUint64();
      const wrapper = createWrapper(shopId);
      const CartTest = createTestComponent(orderId, false);
      const { unmount } = render(<CartTest />, { wrapper });
      const user = userEvent.setup();

      await waitFor(() => {
        const cartScreen = screen.getAllByTestId("cart-item");
        expect(cartScreen).toHaveLength(3);
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
        expect(quantity.textContent).toContain("91");
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
        expect(quantity.textContent).toContain("3");
      });
      // Check statemanager updated correctly.
      await waitFor(async () => {
        const updatedOrder = await stateManager.get(["Orders", orderId]);
        expect(updatedOrder).toBeDefined();
        const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
        expect(updatedOrderItems[0].ListingID).toBe(listingID);
        expect(updatedOrderItems[0].Quantity).toBe(91);
        expect(updatedOrderItems[1].ListingID).toBe(listingID2);
        expect(updatedOrderItems[1].Quantity).toBe(3);
      });
      unmount();
    });

    await t.step(
      "User cannot add more items than stock available",
      async () => {
        const orderId = randUint64();
        const wrapper = createWrapper(shopId);
        const CartTest = createTestComponent(orderId, false);
        const { unmount } = render(<CartTest />, { wrapper });
        const user = userEvent.setup();

        await waitFor(() => {
          const cartScreen = screen.getAllByTestId("cart-item");
          expect(cartScreen).toHaveLength(3);
          // Low stock message is displayed for listing 2.
          const lowStockMessage = within(cartScreen[1]).getByTestId(
            "low-stock-msg",
          );
          expect(lowStockMessage).toBeDefined();
        });

        const addButton = await screen.findByTestId(
          `add-quantity-${listingID3}`,
        );
        await user.click(addButton);

        await waitFor(() => {
          const quantity = screen.getByTestId(
            `quantity-${listingID3}`,
          );
          expect(quantity.textContent).toContain("100");
        });

        await waitFor(async () => {
          // Expect the order items to not have changed
          const updatedOrder = await stateManager.get(["Orders", orderId]);
          expect(updatedOrder).toBeDefined();
          const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
          expect(updatedOrderItems[0].ListingID).toBe(listingID);
          expect(updatedOrderItems[0].Quantity).toBe(90);
          expect(updatedOrderItems[1].ListingID).toBe(listingID2);
          expect(updatedOrderItems[1].Quantity).toBe(4);
          expect(updatedOrderItems[2].ListingID).toBe(listingID3);
          expect(updatedOrderItems[2].Quantity).toBe(100);
        });
        unmount();
      },
    );

    await t.step("Clear cart", async () => {
      const orderId = randUint64();
      const wrapper = createWrapper(shopId);
      const CartTest = createTestComponent(orderId, false);
      const { unmount } = render(<CartTest />, { wrapper });
      const user = userEvent.setup();

      await waitFor(() => {
        const items = screen.getAllByTestId("cart-item");
        expect(items).toHaveLength(3);
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

    // Testing committed order

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
      console.log(
        "Cart Test - committed order: correct number of items displayed",
      );
      // +1 to listing 2
      const addButton = await screen.findByTestId(
        `add-quantity-${listingID2}`,
      );
      await user.click(addButton);

      await waitFor(() => {
        const quantity = screen.getByTestId(
          `quantity-${listingID2}`,
        );
        expect(quantity.textContent).toContain("4");
      });
      console.log("Cart Test - committed order: correct quantity displayed");

      await waitFor(async () => {
        const orders = await stateManager.get(["Orders"]) as Map<
          number,
          unknown
        >;

        const o = orders.get(orderId) as CodecValue;
        expect(o).toBeDefined();
        const order = Order.fromCBOR(o!);
        expect(order.CanceledAt).toBeDefined();
        expect(order.PaymentState).toBe(OrderPaymentState.Canceled);
        // The new order should have the same items as the committed order.
        const newOrder = Array.from(orders.values()).pop() as CodecValue;
        const newOrderItems = Order.fromCBOR(newOrder).Items;
        expect(newOrderItems).toHaveLength(2);
        expect(newOrderItems[1].ListingID).toBe(listingID2);
        expect(newOrderItems[1].Quantity).toBe(4);
      }, { timeout: 10000 });
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

      console.log(
        "Cart Test - clearing cart of a committed order: correct number of items displayed",
      );

      const clearCart = await screen.findByTestId("clear-cart");
      await user.click(clearCart);
      await waitFor(() => {
        const cartItems = screen.queryAllByTestId("cart-item");
        expect(cartItems.length).toBe(0);
      });
      console.log(
        "Cart Test - clearing cart of a committed order: 0 items displayed",
      );

      await waitFor(async () => {
        const orders = await stateManager.get(["Orders"]) as Map<
          number,
          unknown
        >;
        const o = orders.get(orderId) as CodecValue;
        const order = Order.fromCBOR(o!);
        expect(order.CanceledAt).toBeDefined();
        expect(order.PaymentState).toBe(OrderPaymentState.Canceled);
        // The new order should have no items.
        const newOrder = Array.from(orders.values()).pop() as CodecValue;
        const newOrderItems = Order.fromCBOR(newOrder).Items;
        expect(newOrderItems).toHaveLength(0);
      }, { timeout: 10000 });
      unmount();
    });

    await t.step(
      "Commit order with an item that is out of stock",
      async () => {
        const wrapper = createWrapper(shopId);
        const orderId = randUint64();
        const CartTest = createTestComponent(orderId, false);
        const { unmount } = render(<CartTest />, { wrapper });
        const user = userEvent.setup();
        // Reset inventory for listing 3
        await stateManager.set(["Inventory", listingID3], 1);
        await waitFor(() => {
          const cartScreen = screen.getAllByTestId("cart-item");
          expect(cartScreen).toHaveLength(3);
          // Out of stock message is displayed for listing 3
          const noStockMessage = within(cartScreen[2]).getByTestId(
            "no-stock-msg",
          );
          expect(noStockMessage).toBeDefined();
        });

        const checkoutButton = await screen.findByTestId("checkout-button");
        await user.click(checkoutButton);

        await waitFor(async () => {
          // The order that is committed should omit the item that is out of stock.
          const order = await stateManager.get(["Orders", orderId]);
          const o = Order.fromCBOR(order!);
          expect(o.PaymentState).toBe(OrderPaymentState.Committed);
          expect(o.Items).toHaveLength(2);
          // Listing 3 should be removed from the committed order.
          expect(o.Items[0].ListingID).toBe(listingID);
          expect(o.Items[1].ListingID).toBe(listingID2);
        });
        unmount();
      },
    );

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
            new OrderedItem(listingID2, 3),
          ]
          : [
            new OrderedItem(listingID, 90),
            new OrderedItem(listingID2, 4),
            new OrderedItem(listingID3, 100),
          ],
        OrderPaymentState.Open,
      );

      stateManager.set(["Orders", oId], order).then(() => {
        if (!commitOrder) return;
        stateManager.set(
          ["Orders", oId, "PaymentState"],
          OrderPaymentState.Committed,
        );
      });
    }, [listingsLoaded]);

    return <Cart />;
  };
};
