import "../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "jsr:@std/expect";
import { userEvent } from "@testing-library/user-event";
import { zeroAddress } from "viem";
import {
  metadata,
  metadata2,
  payees,
  shippingRegions,
} from "@massmarket/schema/testFixtures";
import { addresses } from "@massmarket/contracts";
import { random256BigInt } from "@massmarket/utils";

import Navigation from "./Navigation.tsx";
import { createRouterWrapper } from "../utils/test.tsx";
import { ListingViewState, OrderState } from "../types.ts";

Deno.test("Check that we can render the navigation bar", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const { wrapper, csm } = await createRouterWrapper();
  const user = userEvent.setup();

  await csm.stateManager!.manifest.create(
    {
      acceptedCurrencies: [{
        chainId: 31337,
        address: zeroAddress,
      }],
      pricingCurrency: { chainId: 31337, address: zeroAddress },
      payees,
      shippingRegions,
    },
    random256BigInt(),
  );
  const item1 = await csm.stateManager!.listings.create({
    price: "12.48",
    metadata,
    viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
  });
  const item2 = await csm.stateManager!.listings.create({
    price: "1.22",
    metadata: metadata2,
    viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
  });
  // Create order and add item to it
  const order = await csm.stateManager!.orders.create();
  await csm.stateManager!.orders.addItems(order.id, [{
    listingId: item1.id,
    quantity: 2,
  }, { listingId: item2.id, quantity: 5 }]);

  const { unmount } = render(<Navigation />, { wrapper });
  screen.debug();
  screen.getByTestId("navigation");

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
      const removeButton = screen.getByTestId(`remove-item-${item1.id}`);
      await user.click(removeButton);
    });

    await waitFor(() => {
      const cartItems = screen.getAllByTestId("cart-item");
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].textContent).toContain(metadata2.title);
    });
  });

  await t.step("Add quantity to item", async () => {
    await act(async () => {
      const addButton = screen.getByTestId(`add-quantity-${item2.id}`);
      await user.click(addButton);
    });
    await waitFor(() => {
      const quantity = screen.getByTestId(`quantity-${item2.id}`);
      expect(quantity.textContent).toContain("6");
    });
  });

  await t.step("Remove quantity from item", async () => {
    await act(async () => {
      const minusQty = screen.getByTestId(`remove-quantity-${item2.id}`);
      await user.click(minusQty);
      await user.click(minusQty);
    });
    await waitFor(() => {
      const quantity = screen.getByTestId(`quantity-${item2.id}`);
      expect(quantity.textContent).toContain("4");
    });
    // Check statemanager updated correctly.
    const updatedOrder = await csm.stateManager!.orders.get(order.id);
    expect(updatedOrder.items[item2.id]).toBe(4);
    expect(updatedOrder.items[item1.id]).toBe(0);
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
    const updatedOrder = await csm.stateManager!.orders.get(order.id);
    expect(updatedOrder.items[item2.id]).toBe(0);
    expect(updatedOrder.items[item1.id]).toBe(0);
  });
  await t.step("Checkout button", async () => {
    await csm.stateManager!.orders.addItems(order.id, [{
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
    const updatedOrder = await csm.stateManager!.orders.get(order.id);
    expect(updatedOrder.status).toBe(OrderState.STATE_COMMITTED);
  });

  unmount();
  cleanup();
});
