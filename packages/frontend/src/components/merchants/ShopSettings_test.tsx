import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "jsr:@std/expect";
import { mainnet, sepolia } from "wagmi/chains";

import { random256BigInt } from "@massmarket/utils";
import { payees, shippingRegions } from "@massmarket/utils/test";
import { addresses } from "@massmarket/contracts";

import ShopSettings from "./ShopSettings.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";

Deno.test("Check that we can render the shop settings screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const user = userEvent.default;
  const { wrapper, csm } = await createRouterWrapper(null);
  await csm.stateManager!.manifest.create(
    {
      acceptedCurrencies: [{
        chainId: mainnet.id,
        address: addresses.zeroAddress,
      }, {
        chainId: sepolia.id,
        address: addresses.zeroAddress,
      }],
      pricingCurrency: { chainId: 1, address: addresses.zeroAddress },
      payees,
      shippingRegions,
    },
    random256BigInt(),
  );
  const { unmount } = await render(<ShopSettings />, { wrapper });
  screen.getByTestId("shop-settings-page");

  await t.step("Check that manifest data is rendered correctly", async () => {
    await waitFor(() => {
      const pricingCurrency = screen.getByTestId("pricing-currency");
      expect(pricingCurrency).toBeTruthy();
      const selectedOption = pricingCurrency.querySelector(
        '[data-testid="selected"]',
      );
      expect(selectedOption).toBeTruthy();
      expect(selectedOption?.textContent).toBe("ETH/Ethereum");
    });

    await waitFor(() => {
      const div = screen.getByTestId("displayed-accepted-currencies");
      const checkboxes = Array.from(
        div.querySelectorAll('input[type="checkbox"]'),
      );
      const checked = checkboxes.filter((checkbox) =>
        (checkbox as HTMLInputElement).checked
      );
      expect(checked.length).toBe(2);
      expect((checked[0] as HTMLInputElement).value).toBe(
        `${addresses.zeroAddress}/${mainnet.id}`,
      );
      expect((checked[1] as HTMLInputElement).value).toBe(
        `${addresses.zeroAddress}/${sepolia.id}`,
      );
    });
  });
  await t.step("Check that we can change the pricing currency", async () => {
    await act(async () => {
      const pricingCurrency = screen.getByTestId("pricing-currency");
      expect(pricingCurrency).toBeTruthy();
      const dropdown = pricingCurrency.querySelector(
        '[data-testid="dropdown"]',
      ) as HTMLInputElement;
      await user.click(dropdown);
    });
    const dropdownOptions = screen.getByTestId("dropdown-options");
    expect(dropdownOptions).toBeTruthy();
    await act(async () => {
      // click on the ETH/Sepolia option
      const option = screen.getByTestId("ETH/Sepolia");
      expect(option).toBeTruthy();
      await user.click(option);
    });
    await act(async () => {
      const submitButton = screen.getByRole("button", { name: "Update" });
      expect(submitButton).toBeTruthy();
      await user.click(submitButton);
    });
    await waitFor(async () => {
      // check manifest is updated
      const manifest = await csm.stateManager!.manifest.get();
      expect(manifest.pricingCurrency!.chainId).toBe(sepolia.id);
      expect(manifest.pricingCurrency!.address).toBe(addresses.zeroAddress);
    });
  });

  await t.step("Check that we can update the accepted currencies", async () => {
    await act(async () => {
      const div = screen.getByTestId("displayed-accepted-currencies");
      const checkboxes = Array.from(
        div.querySelectorAll('input[type="checkbox"]'),
      );
      const EDD = checkboxes.find((checkbox) => {
        return (checkbox as HTMLInputElement).value ===
          `${addresses.Eddies}/${sepolia.id}`;
      }) as HTMLInputElement;
      expect(EDD).toBeTruthy();
      await user.click(EDD as HTMLInputElement);
    });
    await act(async () => {
      const submitButton = screen.getByRole("button", { name: "Update" });
      expect(submitButton).toBeTruthy();
      await user.click(submitButton);
    });
    await waitFor(async () => {
      const manifest = await csm.stateManager!.manifest.get();
      expect(manifest.acceptedCurrencies.length).toBe(3);
      expect(manifest.acceptedCurrencies[0]).toEqual({
        chainId: mainnet.id,
        address: addresses.zeroAddress,
      });
      expect(manifest.acceptedCurrencies[1]).toEqual({
        chainId: sepolia.id,
        address: addresses.zeroAddress,
      });
      expect(manifest.acceptedCurrencies[2]).toEqual({
        chainId: sepolia.id,
        address: addresses.Eddies.toLowerCase(),
      });
    });
  });

  unmount();
  cleanup();
});
