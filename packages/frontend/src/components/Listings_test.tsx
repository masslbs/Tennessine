import "../happyDomSetup.ts";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { zeroAddress } from "viem";
import { expect } from "@std/expect";
import { hardhat } from "wagmi/chains";

import { random256BigInt, random32BytesHex } from "@massmarket/utils";
import {
  metadata,
  metadata2,
  payees,
  shippingRegions,
} from "@massmarket/schema/testFixtures";
import { ListingViewState } from "../types.ts";

import Listings from "./Listings.tsx";
import { createRouterWrapper } from "../testutils/mod.tsx";

Deno.test(
  "Listings screen for both customer and merchant",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  async (t) => {
    const shopId = random256BigInt();
    const { wrapper, csm } = await createRouterWrapper(shopId);
    const privateKey = random32BytesHex();

    csm.keycard = privateKey;
    await csm.stateManager!.manifest.create(
      {
        acceptedCurrencies: [{
          chainId: hardhat.id,
          address: zeroAddress,
        }],
        pricingCurrency: {
          chainId: hardhat.id,
          address: zeroAddress,
        },
        payees,
        shippingRegions,
      },
      random256BigInt(),
    );
    await csm.stateManager!.listings.create({
      price: "12.00",
      metadata,
      viewState: ListingViewState.Published,
    });

    await t.step("Check that the listings are rendered correctly", async () => {
      localStorage.setItem(
        `keycard${shopId}`,
        JSON.stringify({ privateKey, role: "guest-new" }),
      );
      const { unmount } = render(<Listings />, { wrapper });
      screen.debug();
      screen.getByTestId("customer-view-listings");
      await waitFor(() => {
        const listings = screen.getAllByTestId("product-container");
        expect(listings.length).toBe(1);
        const title = within(listings[0]).getByTestId("product-name");
        expect(title.textContent).toEqual(metadata.title);
        const price = within(listings[0]).getByTestId("product-price");
        expect(price.textContent).toEqual("12");
        const coinIcon = within(listings[0]).getByTestId("coin-icon");
        expect(coinIcon.getAttribute("src")).toEqual(
          "/icons/eth-coin.svg",
        );
        const image = within(listings[0]).getByRole("img", {
          name: "product-thumb",
        });
        expect(image.getAttribute("src")).toEqual(metadata.images[0]);
      });
      unmount();
    });
    await t.step("Check that multiple listings are rendered", async () => {
      const { unmount } = render(<Listings />, { wrapper });
      screen.debug();
      screen.getByTestId("customer-view-listings");
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
      unmount();
    });

    await t.step("Render merchant view listings", async () => {
      localStorage.setItem(
        `keycard${shopId}`,
        JSON.stringify({ privateKey, role: "merchant" }),
      );
      const { unmount } = render(<Listings />, { wrapper });

      // Testing event listener.
      await csm.stateManager!.listings.create({
        price: "13.00",
        metadata: metadata2,
        viewState: ListingViewState.Published,
      });
      await waitFor(() => {
        screen.getByTestId("merchant-view-listings");
        const listings = screen.getAllByTestId("product-container");
        expect(listings.length).toBe(52);
      });
      unmount();
    });
    cleanup();
  },
);
