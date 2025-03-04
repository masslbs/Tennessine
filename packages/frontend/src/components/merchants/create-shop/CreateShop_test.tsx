import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "jsr:@std/expect";
import { hardhat } from "wagmi/chains";

import { addresses } from "@massmarket/contracts";
import { random256BigInt, random32BytesHex } from "@massmarket/utils";

import CreateShop from "./CreateShop.tsx";
import { createRouterWrapper } from "../../../utils/test.tsx";

Deno.test("Check that we can render the create shop screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
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
    await user.type(payees, addresses.anvilAddress);
  });
  await act(async () => {
    const pricingCurrency = screen.getByTestId("pricing-currency");
    expect(pricingCurrency).toBeTruthy();
    const dropdown = pricingCurrency.querySelector(
      '[data-testid="dropdown"]',
    ) as HTMLInputElement;
    await user.click(dropdown);
  });

  await act(async () => {
    const dropdownOptions = screen.getByTestId("dropdown-options");
    expect(dropdownOptions).toBeTruthy();
    // click on the ETH/Hardhat option
    const option = screen.getByTestId("ETH/Hardhat");
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

  const { acceptedCurrencies, payees, pricingCurrency, shippingRegions } =
    await csm.stateManager!.manifest.get();
  expect(acceptedCurrencies.length).toBe(1);
  expect(acceptedCurrencies[0].chainId).toBe(hardhat.id);
  expect(acceptedCurrencies[0].address).toBe(addresses.zeroAddress);
  expect(payees.length).toBe(1);
  expect(payees[0].address.toLowerCase()).toBe(
    addresses.anvilAddress.toLowerCase(),
  );
  expect(payees[0].chainId).toBe(hardhat.id);
  expect(shippingRegions.length).toBe(1);
  expect(pricingCurrency!.chainId).toBe(hardhat.id);
  expect(pricingCurrency!.address).toBe(addresses.zeroAddress);

  unmount();
  cleanup();
});
