import "../happyDomSetup.ts";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { expect } from "jsr:@std/expect";

import { addresses } from "@massmarket/contracts";
import { random256BigInt } from "@massmarket/utils";
import { metadata, payees, shippingRegions } from "@massmarket/utils/test";
import { ListingViewState } from "@massmarket/stateManager/types";

import Listings from "./Listings.tsx";
import { createRouterWrapper } from "../utils/test.tsx";

Deno.test("Check that we can render the customer view listings screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const { wrapper, csm } = await createRouterWrapper(null);
  const { unmount } = render(<Listings />, { wrapper });
  await csm.stateManager!.manifest.create(
    {
      acceptedCurrencies: [{
        chainId: 1,
        address: addresses.zeroAddress,
      }],
      pricingCurrency: { chainId: 1, address: addresses.zeroAddress },
      payees,
      shippingRegions,
    },
    random256BigInt(),
  );
  await csm.stateManager!.listings.create({
    price: "12.00",
    metadata,
    viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
  });
  screen.debug();
  screen.getByTestId("customer-view-listings");

  await t.step("Check that the listings are rendered correctly", async () => {
    await waitFor(() => {
      const listings = screen.getAllByTestId("product-container");
      expect(listings.length).toBe(1);
      const title = within(listings[0]).getByTestId("product-name");
      expect(title.textContent).toEqual(metadata.title);
      const price = within(listings[0]).getByTestId("product-price");
      expect(price.textContent).toEqual("12");
      const image = within(listings[0]).getByRole("img", {
        name: "product-thumb",
      });
      expect(image.getAttribute("src")).toEqual(metadata.images[0]);
    });
  });
  await t.step("Check that multiple listings are rendered", async () => {
    for (let index = 0; index < 50; index++) {
      await csm.stateManager!.listings.create({
        price: `${index + 1}`,
        metadata: {
          title: `Test Item ${index + 1}`,
          description: "Test description",
          images: ["https://http.cat/images/201.jpg"],
        },
      });
    }
    await waitFor(() => {
      const listings = screen.getAllByTestId("product-container");
      expect(listings.length).toBe(51);
    });
  });
  unmount();
  cleanup();
});
