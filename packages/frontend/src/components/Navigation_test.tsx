import "../happyDomSetup.ts";
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

import Navigation from "./Navigation.tsx";
import { OrderState } from "../types.ts";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "../testutils/_createWrapper.tsx";

const orderId = randUint64();
const orderId2 = randUint64();
const listingID = 23;
const listingID2 = 42;

Deno.test(
  "Navigation",
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

    await t.step("Add/remove quantity from item", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<NavigationTest />, { wrapper });
      const cartScreen = screen.getByTestId("cart");
      // +1 to listing 1
      await waitFor(async () => {
        const addButton = screen.getByTestId(
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
      const { unmount } = render(<NavigationTest2 />, { wrapper });
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
        const updatedOrder = await stateManager.get(["Orders", orderId2]);
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
        const updatedOrder = await stateManager.get(["Orders", orderId2]);
        expect(updatedOrder).toBeDefined();
        const updatedOrderItems = Order.fromCBOR(updatedOrder!).Items;
        expect(updatedOrderItems.length).toBe(0);
      });
      unmount();
    });

    cleanup();
  }),
);

const createTestComponent = (
  orderId: number,
) => {
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
        orderId,
        [
          new OrderedItem(listingID, 32),
          new OrderedItem(listingID2, 24),
        ],
        OrderState.Open,
      );
      stateManager.set(["Orders", orderId], order);
    }, [listingsLoaded]);

    return <Navigation />;
  };
};

const NavigationTest = createTestComponent(orderId);
const NavigationTest2 = createTestComponent(orderId2);
