import React from "react";
import { describe, expect, test, beforeAll } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  randomAddress,
  zeroAddress,
  random32BytesHex,
} from "@massmarket/utils";
import StoreProfile from "@/app/store/page";
import { merchantsWrapper, getStateManager } from "./test-utils";

describe("StoreProfile Component", async () => {
  const sm = await getStateManager();

  const user = userEvent.setup();
  const randomAddr1 = randomAddress();
  const randomAddr2 = randomAddress();
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
          chainId: 1,
          address: zeroAddress,
        },
        acceptedCurrencies: [
          {
            chainId: 10,
            address: randomAddr1,
          },
          {
            chainId: 2,
            address: randomAddr2,
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

  test("Shop Manifest data is rendered correctly", async () => {
    merchantsWrapper(<StoreProfile />, sm, order.id);
    await waitFor(async () => {
      const baseCurrencyForm = screen.getByDisplayValue(zeroAddress);
      const acceptedCurrencies = screen.getAllByTestId(`accepted-currencies`);
      const tokenAddresses = acceptedCurrencies.map((c) => c.textContent);
      expect(baseCurrencyForm).toBeTruthy();
      expect(tokenAddresses.length).toEqual(2);
      //Correct accepted currencies are rendered
      [randomAddr1, randomAddr2].forEach((c) => {
        expect(tokenAddresses.includes(c)).toBeTruthy();
      });
    });
  });
  test("Add accepted currency via UI", async () => {
    merchantsWrapper(<StoreProfile />, sm, order.id);

    await act(async () => {
      const addButton = screen.getByRole("button", { name: /Add/i });
      const address = randomAddress();
      await user.type(screen.getByTestId(`addTokenAddr`), address);
      await user.type(screen.getByTestId(`addTokenChainId`), "1");
      await user.click(addButton);
    });
    await waitFor(async () => {
      //Test that adding new currency via UI updated the store.
      const manifest = await sm.manifest.get();
      expect(manifest.acceptedCurrencies.length).toEqual(3);

      //Test that UI is updated
      const acceptedCurrencies = screen.getAllByTestId(`accepted-currencies`);
      const tokenAddresses = acceptedCurrencies.map((c) => c.textContent);
      expect(tokenAddresses.length).toEqual(3);
    });
  });
  test("Update store name and pricingCurrency via UI", async () => {
    merchantsWrapper(<StoreProfile />, sm, order.id);

    await act(async () => {
      const chainIdInput = screen.getByTestId(`baseChainId`);
      const addrInput = screen.getByTestId(`baseAddr`);
      await user.clear(chainIdInput);
      await user.clear(addrInput);
      await user.type(addrInput, randomAddr1);
      await user.type(chainIdInput, `2`);
      await user.click(screen.getByRole("button", { name: /Update/i }));
    });
    await waitFor(async () => {
      const manifest = await sm.manifest.get();
      expect(manifest.pricingCurrency!.address).toEqual(randomAddr1);
    });

    //TODO: check that user can update shipping regions.
  });
});
