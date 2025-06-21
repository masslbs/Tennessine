import { render, screen, waitFor, within } from "@testing-library/react";
import { expect } from "@std/expect";
import { formatEther } from "viem";

import { allListings } from "@massmarket/schema/testFixtures";

import Listings from "./Listings.tsx";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "../testutils/_createWrapper.tsx";
import "../happyDomSetup.ts";

Deno.test(
  "Listings",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);

    await t.step("Add a listing to the shop", async () => {
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      for (const [key, entry] of allListings.entries()) {
        await stateManager.set(["Listings", key], entry);
      }
    });

    await t.step("Render listings", async () => {
      const { unmount } = render(<Listings />, {
        wrapper: createWrapper(shopId),
      });
      await waitFor(() => {
        const listings = screen.getAllByTestId("product-container");
        //Should not display deleted listings.
        expect(listings.length).toBe(2);
        const title = within(listings[0]).getByTestId("product-name");
        expect(title.textContent).toEqual("test");
        const price = within(listings[0]).getByTestId("product-price");
        // expect(price.textContent).toEqual("0.00000000000023");
        expect(price.textContent).toEqual(formatEther(BigInt(230000)));
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
  }),
);
