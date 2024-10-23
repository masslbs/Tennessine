import React from "react";
import { screen, waitFor, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, beforeAll, beforeEach } from "vitest";
import { sepolia, hardhat, mainnet } from "wagmi/chains";
import {
  randomAddress,
  zeroAddress,
  random32BytesHex,
  usdcAddress,
} from "@massmarket/utils";
import StoreProfile from "@/app/store/page";
import { merchantsWrapper, getStateManager } from "./test-utils";

describe("StoreProfile Component", async () => {
  const sm = await getStateManager();
  const user = userEvent.setup();

  beforeAll(async () => {
    await sm.manifest.create(
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
  const order = await sm.orders.create();

  beforeEach(async () => {
    merchantsWrapper(<StoreProfile />, sm, order.id);
  });

  test("Shop Manifest data is rendered correctly", async () => {
    merchantsWrapper(<StoreProfile />, sm, order.id);
    await waitFor(async () => {
      const displayedSelections = await screen.findAllByTestId(
        "displayed-accepted-currencies",
      );
      // sepolia and hardhat ETH should be checked since we created the manifest above with those accepted currencies
      const sepoliaETH = displayedSelections.find(
        (element) =>
          element.value === `${zeroAddress}/${sepolia.id}` && element.checked,
      );
      expect(sepoliaETH).toBeTruthy();
      const hardhatETH = displayedSelections.find(
        (element) =>
          element.value === `${zeroAddress}/${sepolia.id}` && element.checked,
      );
      expect(hardhatETH).toBeTruthy();
      // mainnet ETH should not be checked.
      const mainnetEth = displayedSelections.find(
        (element) =>
          element.value === `${zeroAddress}/${mainnet.id}` && element.checked,
      );
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
      const manifest = await sm.manifest.get();
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
      const manifest = await sm.manifest.get();
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
      const { pricingCurrency } = await sm.manifest.get();
      expect(pricingCurrency.chainId).toEqual(sepolia.id);
      expect(pricingCurrency.address).toEqual(usdcAddress.toLowerCase());
    });

    //TODO: check that user can update shipping regions.
  });
});
