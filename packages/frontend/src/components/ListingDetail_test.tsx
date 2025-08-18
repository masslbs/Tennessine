import "../happyDomSetup.ts";
import { render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";

import { Listing, Order } from "@massmarket/schema";
import { allListings } from "@massmarket/schema/testFixtures";
import type { CodecKey, CodecValue } from "@massmarket/utils/codec";

import ListingDetail from "./ListingDetail.tsx";
import { formatUnits } from "viem";
import { OrderState } from "../types.ts";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "../testutils/_createWrapper.tsx";

Deno.test(
  "Listing Detail",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);
    const listingId = 23;
    let listing: Listing;
    const user = userEvent.setup();

    await t.step("Add listing to shop", async () => {
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      for (const [key, entry] of allListings.entries()) {
        if (key === listingId) {
          await stateManager.set(["Listings", key], entry);
          listing = entry;
        }
      }
      // Add some inventory.
      await stateManager.set(["Inventory", listingId], 100);
    });

    await t.step("Customer can add to cart", async () => {
      const wrapper = createWrapper(shopId, `/?itemId=${listingId}`);
      const { unmount } = render(<ListingDetail />, {
        wrapper,
      });
      await screen.findByTestId("listing-detail-page");
      await waitFor(() => {
        // Check that correct data is rendered.
        const price = screen.getByTestId("price");
        expect(price.textContent).toBe(formatUnits(listing.Price, 18));
        const description = screen.getByTestId("description");
        expect(description.textContent).toBe(listing.Metadata.Description);
        const title = screen.getByTestId("title");
        expect(title.textContent).toBe(listing.Metadata.Title);
      });
      // Initial quantity chosen for item
      const initialQty = 2;
      // How much the quantity is increased with on the user's second pass
      const qtyIncreasedBy = 7;
      const qtyIncreasedBy2 = 3;
      const allOrders = await stateManager.get(["Orders"]) as Map<
        string,
        unknown
      >;
      expect(allOrders.size).toBe(0);
      const purchaseQty = await screen.findByTestId("purchaseQty");
      expect(purchaseQty).toBeTruthy();
      await user.clear(purchaseQty);
      await user.type(purchaseQty, `${initialQty}`);
      const addToCart = screen.getByTestId("addToCart");
      await user.click(addToCart);

      // Wait for the success toast to appear
      const successToast = await screen.findByTestId("success-toast");
      expect(successToast).toBeTruthy();
      const successToastText = await screen.findByText(
        `${initialQty} items added`,
      );
      expect(successToastText.textContent?.startsWith(`${initialQty}`))
        .toBeTruthy();

      // Check that the new order created from the user event above has saved correct listing and selected qty.
      let orderId: string;
      await waitFor(async () => {
        const allOrders2 = await stateManager.get(["Orders"]) as Map<
          string,
          unknown
        >;
        expect(allOrders2.size).toBe(1);

        orderId = Array.from(allOrders2.keys())[0];
        const orderData = await stateManager.get(["Orders", orderId]);
        expect(orderData).toBeDefined();

        const order = Order.fromCBOR(orderData!);
        expect(order.Items[0].ListingID).toBe(listingId);
        expect(order.Items[0].Quantity).toBe(initialQty);
      });

      // Update quantity

      const purchaseQty2 = await screen.findByTestId("purchaseQty");
      expect(purchaseQty2).toBeTruthy();
      await user.clear(purchaseQty2);
      await user.type(purchaseQty2, `${qtyIncreasedBy}`);
      const addToCart2 = screen.getByTestId("addToCart");
      await user.click(addToCart2);
      // Wait for the success toast to appear
      const successToast2 = await screen.findByTestId("success-toast");
      expect(successToast2).toBeTruthy();
      // Now: its text should begin with `${qtyIncreasedBy}`
      const successToastText2 = await screen.findByText(
        `${qtyIncreasedBy} items added`,
      );
      expect(successToastText2.textContent?.startsWith(`${qtyIncreasedBy}`))
        .toBeTruthy();

      await waitFor(async () => {
        const d = await stateManager.get(["Orders", orderId!]);
        expect(d).toBeDefined();
        const items = Order.fromCBOR(d!).Items;
        expect(items[0].ListingID).toBe(listingId);
        expect(items[0].Quantity).toBe(initialQty + qtyIncreasedBy);
      });

      // Commit order and try to update quantity. Tests cancelAndRecreateOrder fn
      await stateManager.set(
        ["Orders", orderId!, "State"],
        OrderState.Committed,
      );

      // Here we are updating the listing pricing.
      // This is a trick to make sure the test waits long enough for the frontend to receive the order state update event from the relay.
      // Also tests that the event listerns are set up correctly.

      const newPrice = 270000n;
      await stateManager.set(["Listings", listingId, "Price"], newPrice);
      await waitFor(async () => {
        const price = await screen.findByTestId("price");
        expect(price.textContent).toBe(formatUnits(newPrice, 18));
      });
      // Third quantity update
      const purchaseQty3 = await screen.findByTestId("purchaseQty");
      expect(purchaseQty3).toBeTruthy();
      await user.clear(purchaseQty3);
      await user.type(purchaseQty3, `${qtyIncreasedBy2}`);
      const addToCart3 = screen.getByTestId("addToCart");
      await user.click(addToCart3);

      // Wait for the success toast to appear
      const successToast3 = await screen.findByTestId("success-toast");
      expect(successToast3).toBeTruthy();
      const successToastText3 = await screen.findByText(
        `${qtyIncreasedBy2} items added`,
      );
      expect(successToastText3.textContent?.startsWith(`${qtyIncreasedBy2}`))
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
        const newOrderData = await stateManager.get([
          "Orders",
          newOrderId,
        ]) as Map<
          CodecKey,
          CodecValue
        >;
        const newOrder = Order.fromCBOR(newOrderData);
        // Since quantity was updated 3 times, it should be the addition of the 3 quantities tested.
        const totalQuantity = initialQty + qtyIncreasedBy + qtyIncreasedBy2;
        expect(newOrder.Items[0].Quantity).toBe(totalQuantity);
      });
      unmount();
    });
  }),
);
