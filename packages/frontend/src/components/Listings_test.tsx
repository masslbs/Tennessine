import "../happyDomSetup.ts";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { expect } from "@std/expect";

import { random256BigInt, random32BytesHex } from "@massmarket/utils";
import { allListings } from "@massmarket/schema/testFixtures";
import { Listing, ListingMetadata } from "@massmarket/schema";

import { ListingViewState } from "../types.ts";
import Listings from "./Listings.tsx";
import {
  createRouterWrapper,
  createTestStateManager,
} from "../testutils/mod.tsx";

Deno.test(
  "Listings screen for both customer and merchant",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  async (t) => {
    const shopId = random256BigInt();

    const stateManager = await createTestStateManager(shopId);

    for (const [key, entry] of allListings.entries()) {
      // @ts-ignore TODO: add BaseClass to CodecValue
      await stateManager.set(["Listings", key], entry);
    }

    const { wrapper } = await createRouterWrapper({
      shopId,
      createShop: true,
      enrollMerchant: false,
      stateManager,
    });

    await t.step("Check that the listings are rendered correctly", async () => {
      const { unmount } = render(<Listings />, { wrapper });
      await waitFor(() => {
        // TODO: compare other listings
        // screen.debug();
        const listings = screen.getAllByTestId("product-container");
        expect(listings.length).toBe(3);
        const title = within(listings[0]).getByTestId("product-name");
        expect(title.textContent).toEqual("test");
        const price = within(listings[0]).getByTestId("product-price");
        // expect(price.textContent).toEqual("0.00000000000023");
        expect(price.textContent).toEqual("230000");
        const coinIcon = within(listings[0]).getByTestId("coin-icon");
        expect(coinIcon.getAttribute("src")).toEqual(
          "/icons/eth-coin.svg",
        );
        const image = within(listings[0]).getByRole("img", {
          name: "product-thumb",
        });
        expect(image.getAttribute("src")).toEqual(
          "https://http.cat/images/200.jpg",
        );
      });
      unmount();
    });
    cleanup();
  },
);
