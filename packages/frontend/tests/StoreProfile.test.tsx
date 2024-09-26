import React from "react";
import { describe, expect, test, beforeAll } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { randomAddress, zeroAddress } from "@massmarket/utils";
import StoreProfile from "@/app/components/store/StoreProfile";
import { merchantsWrapper, getStateManager } from "./test-utils";

const sm = getStateManager();

describe("StoreProfile Component", async () => {
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
        baseCurrency: {
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
      },
      randomAddress(),
    );
  });
  const order = await sm.orders.create();

  test("Shop Manifest data is rendered correctly", async () => {
    merchantsWrapper(<StoreProfile close={() => {}} />, sm, order.id);
    await waitFor(async () => {
      // const nameForm = screen.getByDisplayValue("Test Shop");
      const baseCurrencyForm = screen.getByDisplayValue(zeroAddress);
      const acceptedCurrencies = screen.getAllByTestId(`accepted-currencies`);
      const tokenAddresses = acceptedCurrencies.map((c) => c.textContent);
      // expect(nameForm).toBeTruthy;
      expect(baseCurrencyForm).toBeTruthy();
      expect(tokenAddresses.length).toEqual(2);
      //Correct accepted currencies are rendered
      [randomAddr1, randomAddr2].forEach((c) => {
        expect(tokenAddresses.includes(c)).toBeTruthy();
      });
    });
  });
  test("Add accepted currency via UI", async () => {
    merchantsWrapper(<StoreProfile close={() => {}} />, sm, order.id);

    await act(async () => {
      const addButton = screen.getByRole("button", { name: /Add/i });
      const address = randomAddress();
      await user.type(screen.getByTestId(`addTokenAddr`), address);
      await user.type(screen.getByTestId(`addTokenChainId`), "1");
      await user.click(addButton);
    });
    //Test that adding new currency via UI updated the store.
    const manifest = await sm.manifest.get();
    expect(manifest.acceptedCurrencies.length).toEqual(3);

    //Test that UI is updated
    const acceptedCurrencies = screen.getAllByTestId(`accepted-currencies`);
    const tokenAddresses = acceptedCurrencies.map((c) => c.textContent);
    expect(tokenAddresses.length).toEqual(3);
  });
  test("Update store name and baseCurrency via UI", async () => {
    merchantsWrapper(<StoreProfile close={() => {}} />, sm, order.id);

    // await waitFor(async () => {
    //   const nameInput = screen.getByTestId(`storeName`);
    //   await user.clear(nameInput);
    //   await user.type(nameInput, "Updated Store Name");
    //   await user.click(screen.getByRole("button", { name: /Update/i }));
    //   //Test that updating name via UI updated the store.
    //   const manifest = await sm.manifest.get();
    //   expect(manifest.name).toEqual(`Updated Store Name`);
    // });

    await waitFor(async () => {
      const chainIdInput = screen.getByTestId(`baseChainId`);
      const addrInput = screen.getByTestId(`baseAddr`);
      await user.clear(chainIdInput);
      await user.clear(addrInput);
      await user.type(addrInput, randomAddr1);
      await user.type(chainIdInput, `2`);
      await user.click(screen.getByRole("button", { name: /Update/i }));
      const manifest = await sm.manifest.get();
      expect(manifest.baseCurrency!.address).toEqual(randomAddr1);
      // expect(manifest.name).toEqual(`Updated Store Name`);
    });
  });
});
