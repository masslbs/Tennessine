import "../../happyDomSetup.ts";

import { render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { addresses } from "@massmarket/contracts";
import { random256BigInt, random32BytesHex } from "@massmarket/utils";
import {
  metadata,
  payees,
  shippingRegions,
} from "@massmarket/schema/testFixtures";

import MerchantDashboard from "./MerchantDashboard.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";
import { ListingViewState } from "../../types.ts";

Deno.test("Merchant Dashboard", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const shopId = random256BigInt();
  const privateKey = random32BytesHex();
  localStorage.setItem(
    `keycard${shopId}`,
    JSON.stringify({ privateKey, role: "merchant" }),
  );
  const { wrapper, csm } = await createRouterWrapper(
    shopId,
  );
  csm.keycard = privateKey;
  await csm.stateManager!.manifest.create(
    {
      acceptedCurrencies: [{
        chainId: 31337,
        address: addresses.zeroAddress,
      }],
      pricingCurrency: { chainId: 31337, address: addresses.zeroAddress },
      payees,
      shippingRegions,
    },
    shopId,
  );

  await t.step("No orders renders", () => {
    const { unmount } = render(<MerchantDashboard />, { wrapper });
    screen.getByTestId("merchant-dashboard-screen");
    screen.getByTestId("no-transactions");
    unmount();
  });

  await t.step("All orders render", async () => {
    const item1 = await csm.stateManager!.listings.create({
      price: "12.00",
      metadata,
      viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
    });
    const order = await csm.stateManager!.orders.create();
    await csm.stateManager!.orders.addItems(order.id, [{
      listingId: item1.id,
      quantity: 1,
    }]);

    const { unmount } = render(<MerchantDashboard />, { wrapper });
    screen.getByTestId("merchant-dashboard-screen");
    await waitFor(() => {
      screen.getByTestId("transaction");
      expect(screen.getByTestId("id").textContent).toContain(
        order.id?.slice(0, 10),
      );
      expect(screen.getByTestId("date").textContent).toBeDefined();
      expect(screen.getByTestId("status").textContent).toEqual("Open");
    });
    const order2 = await csm.stateManager!.orders.create();
    await csm.stateManager!.orders.addItems(order2.id, [{
      listingId: item1.id,
      quantity: 1,
    }]);
    await csm.stateManager!.orders.commit(order2.id);

    await waitFor(() => {
      const transactions = screen.getAllByTestId("transaction");
      expect(transactions).toBeTruthy();
      expect(transactions.length).toBe(2);
    });

    unmount();
  });
});
