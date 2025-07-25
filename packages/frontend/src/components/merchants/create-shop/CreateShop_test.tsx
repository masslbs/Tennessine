import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";
import { hardhat } from "wagmi/chains";

import CreateShop from "./CreateShop.tsx";
import {
  createWrapper,
  denoTestOptions,
  testAccount,
} from "../../../testutils/_createWrapper.tsx";

Deno.test(
  "Create Shop",
  denoTestOptions,
  async () => {
    const user = userEvent.setup();
    const wrapper = await createWrapper(null, "/create-shop");
    const { unmount } = render(<CreateShop />, {
      wrapper,
    });
    await screen.findByTestId("manifest-form");
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
      const selectElement = pricingCurrency.querySelector("select");
      expect(selectElement).toBeTruthy();
      // Simulate selecting the option using fireEvent
      await user.selectOptions(
        selectElement as HTMLSelectElement,
        "EDD/Hardhat",
      );
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
      const eddHardhat = checkboxes.find((checkbox) => {
        return (checkbox as HTMLInputElement).value ===
          `EDD/${hardhat.id}`;
      }) as HTMLInputElement;

      expect(eddHardhat).toBeTruthy();
      await user.click(eddHardhat as HTMLInputElement);
      await user.click(eddHardhat as HTMLInputElement);
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

    expect(screen.getByTestId("minting-shop")).toBeTruthy();
    // Check that mint() successfully executes.
    await waitFor(() => {
      const shopRegistrationStatus = screen.getByTestId(
        "shop-registration-status",
      );
      expect(shopRegistrationStatus.textContent).toBe("Relay token ID added");
    });
    await waitFor(() => {
      expect(screen.getByTestId("mint-shop-confirmation")).toBeTruthy();
    }, { timeout: 10000 });
    unmount();
    cleanup();
  },
);
