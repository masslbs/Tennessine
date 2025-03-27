import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { zeroAddress } from "viem";
import { generatePrivateKey } from "viem/accounts";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { hardhat } from "wagmi/chains";
import { Manifest } from "@massmarket/schema";
import { random256BigInt, random32BytesHex } from "@massmarket/utils";

import CreateShop from "./CreateShop.tsx";
import { createRouterWrapper } from "../../../testutils/mod.tsx";

Deno.test("Check that we can render the create shop screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const anvilAddress = generatePrivateKey();
  const user = userEvent.setup();
  const shopId = random256BigInt();
  const privateKey = random32BytesHex();
  localStorage.setItem(
    `keycard${shopId}`,
    JSON.stringify({ privateKey, role: "merchant" }),
  );

  const { wrapper, csm } = await createRouterWrapper(
    shopId,
    `/create-shop`,
    null,
  );

  const { unmount } = render(<CreateShop />, { wrapper });

  // This is so that csm doesn't get reset in useClientStateManager while testing, since we need access to the same stateManager.
  csm.keycard = privateKey;

  screen.debug();
  screen.getByTestId("create-shop-screen");
  await act(async () => {
    const shopName = screen.getByTestId(
      "shopName",
    );
    await user.type(shopName, "test shop");
    const shopDescription = screen.getByTestId(
      "description",
    );
    await user.type(shopDescription, "test description");
    const payees = screen.getByTestId(
      "payees",
    );
    await user.clear(payees);
    await user.type(payees, anvilAddress);
  });
  await act(async () => {
    // const pricingCurrency = screen.getByTestId("pricing-currency-dropdown");
    // expect(pricingCurrency).toBeTruthy();
    // await user.click(pricingCurrency);
    const option = screen.getByTestId("pricing-currency-option-EDD/Hardhat");
    expect(option).toBeTruthy();
    await user.click(option);
  });
  await act(async () => {
    const div = screen.getByTestId("accepted-currencies");
    const checkboxes = Array.from(
      div.querySelectorAll('input[type="checkbox"]'),
    );
    expect(checkboxes).toBeTruthy();
    const ethHardhat = checkboxes.find((checkbox) => {
      return (checkbox as HTMLInputElement).value ===
        `ETH/${hardhat.id}`;
    }) as HTMLInputElement;
    expect(ethHardhat).toBeTruthy();
    await user.click(ethHardhat as HTMLInputElement);
    // Select and unselect EDD/Hardhat option
    const eddHarhat = checkboxes.find((checkbox) => {
      return (checkbox as HTMLInputElement).value ===
        `EDD/${hardhat.id}`;
    }) as HTMLInputElement;
    expect(eddHarhat).toBeTruthy();
    await user.click(eddHarhat as HTMLInputElement);
    await user.click(eddHarhat as HTMLInputElement);
  });
  await act(async () => {
    const connectWalletButton = screen.getByRole("button", {
      name: /Connect Wallet/i,
    });
    expect(connectWalletButton).toBeTruthy();
    await user.click(connectWalletButton);
  });

  await act(async () => {
    const mintShopButton = await screen.findByRole("button", {
      name: /Mint Shop/i,
    });
    expect(mintShopButton).toBeTruthy();
    await user.click(mintShopButton);
  });

  await waitFor(() => {
    // This is a long timeout because the minting process can be slow.
    expect(screen.getByTestId("mint-shop-confirmation")).toBeTruthy();
  }, { timeout: 15000 });

  const manifest = Manifest.fromCBOR(
    await csm.stateManager!.get(["Manifest"]) as Map<string, unknown>,
  );
  // check accepted currencies
  expect(manifest.AcceptedCurrencies.size).toBe(1);
  const acceptedCurrency = manifest.AcceptedCurrencies.getAddressesByChainID(
    hardhat.id,
  );
  expect(acceptedCurrency).toBeTruthy();
  expect(acceptedCurrency!.size).toBe(1);
  // get first value
  const acceptedCurrencyAddress = acceptedCurrency!.keys().next().value;
  expect(acceptedCurrencyAddress).toBeTruthy();
  expect(acceptedCurrencyAddress).toBe(zeroAddress);

  // check payees
  expect(manifest.Payees.size).toBe(1);
  const payees = manifest.Payees.get(hardhat.id);
  expect(payees).toBeTruthy();
  expect(payees!.size).toBe(1);
  // get first value
  const payeeAddress = payees!.keys().next().value;
  expect(payeeAddress).toBeTruthy();
  expect(payeeAddress).toBe(anvilAddress);
  expect(payees!.get(payeeAddress!)!.CallAsContract).toBe(true);

  // check pricing currency
  expect(manifest.PricingCurrency.ChainID).toBe(hardhat.id);
  expect(manifest.PricingCurrency.Address).toBe(zeroAddress);

  unmount();
  cleanup();
});
