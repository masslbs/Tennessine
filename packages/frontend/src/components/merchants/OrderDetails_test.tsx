import "../../happyDomSetup.ts";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { allOrderListings, allOrders } from "@massmarket/schema/testFixtures";
import { Listing, Order } from "@massmarket/schema";
import { useKeycard } from "@massmarket/react-hooks";

import OrderDetails from "./OrderDetails.tsx";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "../../testutils/_createWrapper.tsx";

Deno.test(
  "Order Detail",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const orderId = 666;
    const listingId1 = 5555;
    const listingId2 = 5556;
    const order = allOrders.get(orderId) as Order;
    order.ShippingAddress = order.InvoiceAddress;

    await t.step("Add listings to shop.", async () => {
      const relayClient = await createTestRelayClient(shopId);
      const stateManager = await createTestStateManager(shopId);
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      //Add listings to shop
      for (const [key, entry] of allOrderListings.entries()) {
        await stateManager.set(["Listings", key], entry);
      }
    });

    await t.step("Add order to shop.", async () => {
      // Add order as customer.
      const relayClient = await createTestRelayClient(shopId, true);
      const stateManager = await createTestStateManager(shopId);
      stateManager.addConnection(relayClient);
      await stateManager.set(["Orders", orderId], order);
    });

    await t.step("Render order details.", async () => {
      const wrapper = createWrapper(shopId, `/?orderId=${orderId}`);
      const { unmount } = render(<TestComponent />, { wrapper });
      await screen.findByTestId("order-details-page");

      const listing1 = allOrderListings.get(listingId1) as Listing;
      const listing2 = allOrderListings.get(listingId2) as Listing;

      await waitFor(async () => {
        const orderItem = await screen.findAllByTestId("order-item");
        expect(orderItem.length).toBe(2);
        expect(orderItem[0].textContent).toContain(
          `${listing1.Metadata.Title}`,
        );
        expect(orderItem[1].textContent).toContain(
          `${listing2.Metadata.Title}`,
        );

        const details = await screen.findByTestId("shipping-details");
        expect(details).toBeTruthy();
        expect(details.textContent).toContain(order.ShippingAddress!.Name);
        expect(details.textContent).toContain(order.ShippingAddress!.Address1);
        expect(details.textContent).toContain(order.ShippingAddress!.City);
        expect(details.textContent).toContain(order.ShippingAddress!.Country);
        expect(details.textContent).toContain(
          order.ShippingAddress!.PostalCode,
        );
      });

      unmount();
    });

    cleanup();
  }),
);

const TestComponent = () => {
  useKeycard();
  return <OrderDetails />;
};
