import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { generatePrivateKey } from "viem/accounts";
import { hexToBytes } from "viem";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { hardhat } from "wagmi/chains";

import { Manifest } from "@massmarket/schema";
import { random256BigInt } from "@massmarket/utils";
import { abi } from "@massmarket/contracts";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";

import CreateShop from "./CreateShop.tsx";
import { createRouterWrapper } from "../../../testutils/mod.tsx";

const zeroAddressBytes = new Uint8Array(20);

Deno.test("Check that we can create a shop", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const user = userEvent.setup();
  const shopId = random256BigInt();
  const privateKey = generatePrivateKey();
  localStorage.setItem(
    `keycard${shopId}`,
    JSON.stringify({ privateKey, role: "merchant" }),
  );

  const { wrapper, stateManager, testAccount } = await createRouterWrapper({
    path: `/create-shop`,
  });

  const { unmount } = render(<CreateShop />, { wrapper });

  // screen.debug();
  screen.getByTestId("create-shop-screen");
  await act(async () => {
    const shopName = screen.getByTestId("shopName");
    await user.type(shopName, "test shop");
    const shopDescription = screen.getByTestId("description");
    await user.type(shopDescription, "test description");
    const payees = screen.getByTestId("payees");
    await user.clear(payees);
    await user.type(payees, testAccount);
  });
  await act(async () => {
    const pricingCurrency = screen.getByTestId("pricing-currency-dropdown");
    expect(pricingCurrency).toBeTruthy();
    // Replace clicking with a proper select element change
    const selectElement = pricingCurrency.querySelector("select");
    expect(selectElement).toBeTruthy();
    // Simulate selecting the option using fireEvent
    await user.selectOptions(selectElement as HTMLSelectElement, "EDD/Hardhat");
    // Now we can verify the selection was made
    expect((selectElement as HTMLSelectElement).value).toBe("EDD/Hardhat");
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

  let manifest = new Manifest();
  await waitFor(async () => {
    manifest = Manifest.fromCBOR(
      await stateManager.get(["Manifest"]) as Map<CodecKey, CodecValue>,
    );
    expect(manifest.AcceptedCurrencies.size).toBe(1);
  });
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
  expect(acceptedCurrencyAddress).toEqual(zeroAddressBytes);

  // check payees
  expect(manifest.Payees.size).toBe(1);
  const payees = manifest.Payees.get(hardhat.id);
  expect(payees).toBeTruthy();
  expect(payees!.size).toBe(1);

  // get first value
  const payeeAddress = payees!.keys().next().value;
  expect(payeeAddress).toBeTruthy();
  expect(payeeAddress).toEqual(hexToBytes(testAccount));
  expect(payees!.get(payeeAddress!)!.CallAsContract).toBe(false);

  // check pricing currency
  expect(manifest.PricingCurrency.ChainID).toBe(hardhat.id);
  expect(manifest.PricingCurrency.Address).toEqual(
    hexToBytes(abi.eddiesAddress),
  );

  unmount();
  cleanup();
});
