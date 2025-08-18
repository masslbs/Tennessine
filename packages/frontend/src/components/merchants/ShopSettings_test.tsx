import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { hardhat } from "wagmi/chains";
import { hexToBytes } from "viem";
import { equal } from "@std/assert";

import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import { allManifests } from "@massmarket/schema/testFixtures";
import {
  AcceptedCurrencyMap,
  ChainAddress,
  Manifest,
} from "@massmarket/schema";
import { abi, setTokenURI } from "@massmarket/contracts";
import { useKeycard } from "@massmarket/react-hooks";

import ShopSettings from "./ShopSettings.tsx";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testAccount,
  testClient,
  testWrapper,
} from "../../testutils/_createWrapper.tsx";

Deno.test(
  "Shop settings",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const user = userEvent.setup();
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);

    await t.step("Add manifest to shop.", async () => {
      const m = allManifests[0];
      const manifest = Manifest.fromCBOR(m!);

      manifest.ShopID = shopId;
      manifest.PricingCurrency = new ChainAddress(
        hardhat.id,
        new Uint8Array(20),
      );
      const ac = new AcceptedCurrencyMap();
      ac.addAddress(hardhat.id, new Uint8Array(20), false);
      manifest.AcceptedCurrencies = ac;

      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      await stateManager.set(["Manifest"], manifest);

      // Set shop name/avatar.
      const metadataHash = await setTokenURI(testClient!, testAccount, [
        shopId,
        "https://dummyjson.com/c/0a7c-cc65-4739-8899",
      ]);

      const transaction = await testClient!.waitForTransactionReceipt({
        hash: metadataHash,
        retryCount: 10,
      });
      expect(transaction.status).toBe("success");
    });

    await t.step(
      "Check that manifest data is rendered correctly.",
      async () => {
        const wrapper = createWrapper(shopId);
        const { unmount } = render(<TestComponent />, { wrapper });
        await waitFor(() => {
          const pricingCurrency = screen.getByTestId(
            "pricing-currency-dropdown",
          );
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
        unmount();
      },
    );

    await t.step(
      "Check that we can update accepted/pricing currency.",
      async () => {
        const wrapper = createWrapper(shopId);
        const { unmount } = render(<TestComponent />, { wrapper });
        await waitFor(() => {
          const shopNameInput = screen.getByTestId(
            "shopName",
          ) as HTMLInputElement;
          expect(shopNameInput.placeholder).toBe("shopName");
        });

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
          const pricingCurrency = screen.getByTestId(
            "pricing-currency-dropdown",
          );
          const selectElement = pricingCurrency.querySelector("select");
          expect(selectElement).toBeTruthy();
          await user.selectOptions(
            selectElement as HTMLSelectElement,
            "EDD/Hardhat",
          );
          expect((selectElement as HTMLSelectElement).value).toBe(
            "EDD/Hardhat",
          );
        });
        await act(async () => {
          const submitButton = screen.getByRole("button", { name: "Save" });
          expect(submitButton).toBeTruthy();
          await user.click(submitButton);
        });

        await waitFor(async () => {
          // check manifest is updated
          const m = await stateManager.get(["Manifest"]);
          expect(m).toBeInstanceOf(Map<CodecKey, CodecValue>);
          const manifest = Manifest.fromCBOR(m!);
          expect(manifest.PricingCurrency!.ChainID).toBe(hardhat.id);
          expect(
            equal(
              manifest.PricingCurrency!.Address,
              hexToBytes(abi.eddiesAddress),
            ),
          ).toBe(true);
        });

        await waitFor(() => {
          const successToast = screen.getByTestId("success-toast");
          expect(successToast).toBeTruthy();
          expect(successToast.textContent).toBe("Changes saved.");
        });
        unmount();
      },
    );
    cleanup();
  }),
);

const TestComponent = () => {
  useKeycard();
  return <ShopSettings />;
};
