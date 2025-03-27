import "../../happyDomSetup.ts";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { zeroAddress } from "viem";

import { random256BigInt } from "@massmarket/utils";
import {
  metadata,
  metadata2,
  payees,
  shippingDetails,
  shippingRegions,
} from "@massmarket/schema/testFixtures";

import OrderDetails from "./OrderDetails.tsx";
import {
  createClientStateManager,
  createRouterWrapper,
} from "../../utils/test.tsx";
import { ListingViewState } from "../../types.ts";

Deno.test("Check that we can render the order details screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const csm = await createClientStateManager();

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
    price: "12.00",
    metadata,
    viewState: ListingViewState.Published,
  });
  const item2 = await csm.stateManager!.listings.create({
    price: "1.00",
    metadata: metadata2,
    viewState: ListingViewState.Published,
  });
  // Create order and add item to it
  const order = await csm.stateManager!.orders.create();
  await csm.stateManager!.orders.addItems(order.id, [{
    listingId: item1.id,
    quantity: 2,
  }, { listingId: item2.id, quantity: 5 }]);
  await csm.stateManager!.orders.commit(order.id);
  await csm.stateManager!.orders.updateShippingDetails(
    order.id,
    shippingDetails,
  );
  const { wrapper } = await createRouterWrapper(
    null,
    "/?orderId=" + order.id,
    csm,
  );

  const { unmount } = render(<OrderDetails />, { wrapper });
  screen.debug();
  screen.getByTestId("order-details-page");
  await waitFor(() => {
    const orderItem = screen.getAllByTestId("order-item");
    expect(orderItem.length).toBe(2);
    expect(orderItem[0].textContent).toBe(metadata.title);
    expect(orderItem[1].textContent).toBe(metadata2.title);
    const details = screen.getByTestId("shipping-details");
    expect(details).toBeTruthy();
    expect(details.textContent).toContain(shippingDetails.name);
    expect(details.textContent).toContain(shippingDetails.address1);
    expect(details.textContent).toContain(shippingDetails.city);
    expect(details.textContent).toContain(shippingDetails.country);
    expect(details.textContent).toContain(shippingDetails.postalCode);
    expect(details.textContent).toContain(shippingDetails.emailAddress);
    expect(details.textContent).toContain(shippingDetails.phoneNumber);
  });
  unmount();
  cleanup();
});
