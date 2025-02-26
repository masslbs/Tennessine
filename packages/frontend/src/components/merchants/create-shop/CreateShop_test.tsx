import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "jsr:@std/expect";
import { hardhat } from "wagmi/chains";
import { connect } from "npm:wagmi/actions";

import { addresses } from "@massmarket/contracts";

import CreateShop from "./CreateShop.tsx";
import { config, createRouterWrapper } from "../../../utils/test.tsx";

Deno.test("Check that we can render the create shop screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const user = userEvent.setup();

  const { wrapper } = await createRouterWrapper(null, "/create-shop");
  const { unmount } = await render(<CreateShop />, { wrapper });
  // Set connector chainId to hardhat.
  await config.connectors[0].connect({ chainId: hardhat.id });
  await connect(config, { connector: config.connectors[0] });

  screen.debug();
  screen.getByTestId("create-shop-page");
  await act(async () => {
    const shopName = screen.getByTestId(
      "storeName",
    );
    await user.type(shopName, "test shop");
    const shopDescription = screen.getByTestId(
      "desc",
    );
    await user.type(shopDescription, "test description");
    const payeeAddress = screen.getByTestId(
      "payeeAddress",
    );
    await user.clear(payeeAddress);
    await user.type(payeeAddress, addresses.anvilAddress);
  });
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
  });
  await act(async () => {
    const connectWalletButton = screen.getByRole("button", {
      name: /Connect Wallet/i,
    });
    expect(connectWalletButton).toBeTruthy();
    await user.click(connectWalletButton);
  });
  unmount();
  cleanup();
});
