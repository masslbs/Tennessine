import React from "react";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { hardhat, mainnet, sepolia } from "wagmi/chains";
import {
  random32BytesHex,
  randomAddress,
  zeroAddress,
} from "@massmarket/utils";
import StoreProfile from "@/app/store/page";
import { getMockClient, MerchantsRender } from "./test-utils";

export const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("StoreProfile Component", async () => {
  const client = await getMockClient();
  const user = userEvent.setup();

  beforeAll(async () => {
    await client!.stateManager!.manifest.create(
      {
        payees: [
          {
            address: randomAddress(),
            callAsContract: false,
            chainId: 1,
            name: "default",
          },
        ],
        pricingCurrency: {
          chainId: hardhat.id,
          address: zeroAddress,
        },
        acceptedCurrencies: [
          {
            chainId: hardhat.id,
            address: zeroAddress,
          },
          {
            chainId: sepolia.id,
            address: zeroAddress,
          },
        ],
        shippingRegions: [
          {
            name: "test",
            country: "test country",
            postalCode: "test postal",
            city: "test city",
            orderPriceModifiers: [
              {
                title: "EU VAT",
                percentage: random32BytesHex(),
              },
            ],
          },
        ],
      },
      randomAddress(),
    );
  });

  beforeEach(async () => {
    MerchantsRender(<StoreProfile />, client);
  });

  test("Shop Manifest data is rendered correctly", async () => {
    MerchantsRender(<StoreProfile />, client);
    await waitFor(async () => {
      const displayedSelections = await screen.findAllByTestId(
        "displayed-accepted-currencies",
      );
      // sepolia and hardhat ETH should be checked since we created the manifest above with those accepted currencies
      const sepoliaETH = displayedSelections.find((element) => {
        const ele = element as HTMLInputElement;
        return ele.value === `${zeroAddress}/${sepolia.id}` && ele.checked;
      });
      expect(sepoliaETH).toBeTruthy();
      const hardhatETH = displayedSelections.find((element) => {
        const ele = element as HTMLInputElement;
        return ele.value === `${zeroAddress}/${sepolia.id}` && ele.checked;
      });
      expect(hardhatETH).toBeTruthy();
      // mainnet ETH should not be checked.
      const mainnetEth = displayedSelections.find((element) => {
        const ele = element as HTMLInputElement;
        return ele.value === `${zeroAddress}/${mainnet.id}` && ele.checked;
      });
      expect(mainnetEth).not.toBeTruthy();
    });
  });
  test("Change accepted currency via UI", async () => {
    await screen.findAllByTestId("displayed-accepted-currencies");
    await act(async () => {
      const sepoliaETH = screen.getByLabelText("ETH/Sepolia");
      await user.click(sepoliaETH);
    });
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Update/i }));
    });
    await waitFor(async () => {
      //Test that removing currency via UI updated the store.
      const manifest = await client!.stateManager!.manifest.get();
      expect(manifest.acceptedCurrencies.length).toEqual(1);
      expect(manifest.acceptedCurrencies[0].address).toEqual(zeroAddress);
      expect(manifest.acceptedCurrencies[0].chainId).toEqual(hardhat.id);
    });
    await act(async () => {
      const sepoliaUSDC = screen.getByLabelText("USDC/Sepolia");
      await user.click(sepoliaUSDC);
    });
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Update/i }));
    });
    await waitFor(async () => {
      //Test that adding new currency via UI updated the store.
      const manifest = await client!.stateManager!.manifest.get();
      expect(manifest.acceptedCurrencies.length).toEqual(2);
      expect(manifest.acceptedCurrencies[1].address).toEqual(
        usdcAddress.toLowerCase(),
      );
      expect(manifest.acceptedCurrencies[1].chainId).toEqual(sepolia.id);
    });
  });

  test("Update store name and pricingCurrency via UI", async () => {
    await act(async () => {
      const withinPricingCurrency = within(
        screen.getByTestId("pricing-currency"),
      );
      const pricingDropdown = withinPricingCurrency.getByTestId("dropdown");
      await user.click(pricingDropdown);
    });
    await waitFor(async () => {
      const usdcSepolia = await screen.findByTestId("USDC/Sepolia");
      await user.click(usdcSepolia);
    });
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Update/i }));
    });
    await waitFor(async () => {
      const { pricingCurrency } = await client!.stateManager!.manifest.get();
      expect(pricingCurrency.chainId).toEqual(sepolia.id);
      expect(pricingCurrency.address).toEqual(usdcAddress.toLowerCase());
    });

    //TODO: check that user can update shipping regions.
  });
});
