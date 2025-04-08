import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { hardhat } from "wagmi/chains";
import { hexToBytes, zeroAddress } from "viem";
import { equal } from "@std/assert";

import { random256BigInt } from "@massmarket/utils";
import { allManifests } from "@massmarket/schema/testFixtures";
import {
  AcceptedCurrencyMap,
  ChainAddress,
  Manifest,
} from "@massmarket/schema";
import { abi } from "@massmarket/contracts";

import ShopSettings from "./ShopSettings.tsx";
import { createRouterWrapper } from "../../testutils/mod.tsx";

Deno.test("Check that we can render the shop settings screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const user = userEvent.setup();
  const m = allManifests[0];
  const manifest = Manifest.fromCBOR(m as Map<string, unknown>);
  const shopId = random256BigInt();

  const {
    wrapper,
    stateManager,
  } = await createRouterWrapper({
    shopId,
    createShop: true,
    enrollMerchant: true,
  });
  manifest.ShopID = shopId;
  manifest.PricingCurrency = new ChainAddress(
    hardhat.id,
    hexToBytes(zeroAddress),
  );
  const ac = new AcceptedCurrencyMap();
  ac.addAddress(hardhat.id, hexToBytes(zeroAddress), false);
  manifest.AcceptedCurrencies = ac;
  // @ts-ignore TODO: add BaseClass to CodecValue

  await stateManager.set(["Manifest"], manifest);
  const { unmount } = render(<ShopSettings />, { wrapper });
  screen.getByTestId("shop-settings-page");

  await t.step("Check that manifest data is rendered correctly", async () => {
    await waitFor(() => {
      const pricingCurrency = screen.getByTestId("pricing-currency-dropdown");
      expect(pricingCurrency).toBeTruthy();
      const selectElement = pricingCurrency.querySelector("select");
      // Check that the correct currency is displayed as pre selected.
      expect(selectElement!.value).toEqual("ETH/Hardhat");
    });

    await waitFor(() => {
      const div = screen.getByTestId("displayed-accepted-currencies");
      const checkboxes = Array.from(
        div.querySelectorAll('input[type="checkbox"]'),
      );
      const checked = checkboxes.filter((checkbox) => {
        return (checkbox as HTMLInputElement).checked;
      });
      expect(checked.length).toBe(1);
      expect((checked[0] as HTMLInputElement).value).toBe(
        `ETH/${hardhat.id}`,
      );
    });
  });

  await t.step(
    "Check that we can update accepted/pricing currency",
    async () => {
      await act(async () => {
        const div = screen.getByTestId("displayed-accepted-currencies");
        const checkboxes = Array.from(
          div.querySelectorAll('input[type="checkbox"]'),
        );
        const ethHardhat = checkboxes.find((checkbox) => {
          const val = (checkbox as HTMLInputElement).value;
          return val === `EDD/${hardhat.id}`;
        });
        expect(ethHardhat).toBeTruthy();
        await user.click(ethHardhat as HTMLInputElement);
      });

      await act(async () => {
        const pricingCurrency = screen.getByTestId("pricing-currency-dropdown");
        const selectElement = pricingCurrency.querySelector("select");
        expect(selectElement).toBeTruthy();
        await user.selectOptions(
          selectElement as HTMLSelectElement,
          "EDD/Hardhat",
        );
        expect((selectElement as HTMLSelectElement).value).toBe("EDD/Hardhat");
      });
      await act(async () => {
        const submitButton = screen.getByRole("button", { name: "Update" });
        expect(submitButton).toBeTruthy();
        await user.click(submitButton);
      });
      await waitFor(async () => {
        // check manifest is updated
        const m = await stateManager.get(["Manifest"]);
        const manifest = Manifest.fromCBOR(m as Map<string, unknown>);
        expect(manifest.PricingCurrency!.ChainID).toBe(hardhat.id);
        expect(
          equal(
            manifest.PricingCurrency!.Address,
            hexToBytes(abi.eddiesAddress),
          ),
        ).toBe(true);
      });
    },
  );
  unmount();
  cleanup();
});
