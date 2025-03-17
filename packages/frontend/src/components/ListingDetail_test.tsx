import "../happyDomSetup.ts";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { zeroAddress } from "viem";
import { expect } from "jsr:@std/expect";
import { userEvent } from "@testing-library/user-event";

import { metadata } from "@massmarket/schema/testFixtures";
import { random256BigInt } from "@massmarket/utils";
import { payees, shippingRegions } from "@massmarket/schema/testFixtures";

import ListingDetail from "./ListingDetail.tsx";
import {
  createClientStateManager,
  createRouterWrapper,
} from "../utils/test.tsx";
import { ListingViewState, OrderState } from "../types.ts";

Deno.test("Check that we can render the listing details screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const user = userEvent.setup();
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
    viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
  });
  const { wrapper } = await createRouterWrapper(
    null,
    "/?itemId=" + item1.id,
    csm,
  );
  const { unmount } = render(<ListingDetail />, { wrapper });
  screen.debug();
  screen.getByTestId("listing-detail-page");
  await waitFor(() => {
    const price = screen.getByTestId("price");
    expect(price.textContent).toBe("12.00");
    const description = screen.getByTestId("description");
    expect(description.textContent).toBe(metadata.description);
    const title = screen.getByTestId("title");
    expect(title.textContent).toBe(metadata.title);
  });
  // Test adding to cart
  await waitFor(async () => {
    const purchaseQty = screen.getByTestId("purchaseQty");
    expect(purchaseQty).toBeTruthy();
    await user.type(purchaseQty, "2");
    const addToBasket = screen.getByTestId("addToBasket");
    await user.click(addToBasket);
  });

  const openOrder = await csm.stateManager!.orders.getStatus(
    OrderState.STATE_OPEN,
  );
  const order = await csm.stateManager!.orders.get(openOrder[0]);
  expect(order.items[item1.id]).toBe(2);
  expect(Object.keys(order.items).length).toBe(1);
  unmount();
  cleanup();
});
