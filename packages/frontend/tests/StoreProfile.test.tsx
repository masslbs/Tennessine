import React from "react";
import { describe, expect, test } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { randomAddress, zeroAddress } from "@massmarket/utils";
import StoreProfile from "@/app/components/store/StoreProfile";
import { authorizedRender, getStateManager } from "./test-utils";

const sm = getStateManager();

describe("StoreProfile Component", async () => {
  const user = userEvent.setup();
  const order = await sm.orders.create();

  await sm.manifest.create(
    {
      name: "Test Shop",
      description: "Testing shopManifest",
    },
    randomAddress(),
  );

  const randomTokenAddr = randomAddress();
  await sm.manifest.update({
    addAcceptedCurrencies: [
      {
        chainId: 10,
        tokenAddr: zeroAddress,
      },
      {
        chainId: 2,
        tokenAddr: randomTokenAddr,
      },
    ],
    setBaseCurrency: {
      chainId: 1,
      tokenAddr: zeroAddress,
    },
  });
  test("Shop Manifest data is rendered correctly", async () => {
    authorizedRender(<StoreProfile close={() => {}} />, sm, order.id);
    await waitFor(async () => {
      const nameForm = screen.getByDisplayValue("Test Shop");
      const baseCurrencyForm = screen.getByDisplayValue(zeroAddress);
      const acceptedCurrencies = screen.getAllByTestId(`accepted-currencies`);
      const tokenAddresses = acceptedCurrencies.map((c) => c.textContent);
      expect(nameForm).toBeTruthy;
      expect(baseCurrencyForm).toBeTruthy;
      expect(tokenAddresses.length).toEqual(2);
      //Correct accepted currencies are rendered
      [randomTokenAddr, zeroAddress].forEach((c) => {
        expect(tokenAddresses.includes(c)).toBeTruthy;
      });
    });
  });
  test("Add accepted currency via UI", async () => {
    authorizedRender(<StoreProfile close={() => {}} />, sm, order.id);

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
    authorizedRender(<StoreProfile close={() => {}} />, sm, order.id);

    await waitFor(async () => {
      const nameInput = screen.getByTestId(`storeName`);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Store Name");
      await user.click(screen.getByRole("button", { name: /Update/i }));
      //Test that updating name via UI updated the store.
      const manifest = await sm.manifest.get();
      expect(manifest.name).toEqual(`Updated Store Name`);
    });

    await waitFor(async () => {
      const chainIdInput = screen.getByTestId(`baseChainId`);
      const addrInput = screen.getByTestId(`baseAddr`);
      await user.clear(chainIdInput);
      await user.clear(addrInput);
      await user.type(addrInput, randomTokenAddr);
      await user.type(chainIdInput, `2`);
      await user.click(screen.getByRole("button", { name: /Update/i }));
      const manifest = await sm.manifest.get();
      expect(manifest.setBaseCurrency!.tokenAddr).toEqual(randomTokenAddr);
      expect(manifest.name).toEqual(`Updated Store Name`);
    });
  });
});
