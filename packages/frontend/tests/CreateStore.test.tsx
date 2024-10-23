import React from "react";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createPublicClient, http, Address } from "viem";
import { hardhat } from "viem/chains";

import { randomAddress, zeroAddress } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import { ShopId } from "@/types";
import CreateStore from "@/app/create-store/page";
import { ClientWithStateManager } from "@/app/ClientWithStateManager";
import { MerchantsRender, getClient } from "./test-utils";

beforeEach(async () => {
  vi.mock(import("wagmi"), async (importOriginal) => {
    const mod = await importOriginal(); // type is inferred
    return {
      ...mod,
      useAccount() {
        return {
          status: "connected",
        };
      },
    };
  });
});

afterEach(async () => {
  vi.restoreAllMocks();
});

describe("Create Store", async () => {
  let client: ClientWithStateManager;

  const user = userEvent.setup();
  beforeEach(async () => {
    client = await getClient();
    MerchantsRender(<CreateStore />, client);
  });

  test("Create with all required fields", async () => {
    const payee = randomAddress();
    await act(async () => {
      const file = new File(["hello"], "hello.png", { type: "image/png" });

      const nameInput = screen.getByTestId(`storeName`);
      const descInput = screen.getByTestId(`desc`);
      const acceptedCurrencies = screen.getByRole("checkbox", {
        name: "ETH/Hardhat",
      });
      const uploadInput = screen.getByTestId("file-upload");
      const payeeInput = screen.getByTestId("payeeAddress");
      const withinPricingCurrency = within(
        screen.getByTestId("pricing-currency"),
      );
      const pricingDropdown = withinPricingCurrency.getByTestId("dropdown");
      const withinPayeeDropdown = within(screen.getByTestId("payee-info"));
      const payeeDropdown = withinPayeeDropdown.getByTestId("dropdown");

      await user.upload(uploadInput, file);
      await user.click(acceptedCurrencies);
      await user.clear(nameInput);
      await user.clear(descInput);
      await user.clear(payeeInput);
      await user.click(pricingDropdown);
      await user.click(payeeDropdown);
      await user.type(nameInput, "New Store Name II");
      await user.type(descInput, "New Store Description II");
      await user.type(payeeInput, payee);
      const pricingCurrency = await screen.findByTestId("USDC/Hardhat");
      await user.click(pricingCurrency);
      const payeeSelection = await screen.findByTestId("Hardhat");
      await user.click(payeeSelection);
    });
    await act(async () => {
      const saveBtn = screen.getByRole("button", { name: "Connect Wallet" });
      await user.click(saveBtn);
    });

    await act(async () => {
      const mint = await screen.findByRole("button", { name: "Mint Shop" });
      await user.click(mint);
    });

    let shopId: ShopId;
    await waitFor(async () => {
      await screen.findByTestId("confirmation");
      const manifest = await client!.stateManager!.manifest.get();
      shopId = manifest.tokenId!;
      const { pricingCurrency, payees, acceptedCurrencies } = manifest;
      expect(acceptedCurrencies[0].address).toEqual(zeroAddress);
      expect(acceptedCurrencies[0].chainId).toEqual(31337);
      expect(pricingCurrency.address).toEqual(
        //USDC address - since we select USDC/Hardhat above.
        abi.tokenAddresses["31337"]["USDC"].toLowerCase(),
      );
      expect(pricingCurrency.chainId).toEqual(31337);
      expect(payees[0].address).toEqual(payee);
      expect(payees[0].chainId).toEqual(31337);
    });
    await waitFor(async () => {
      const publicClient = createPublicClient({
        chain: hardhat,
        transport: http(),
      });
      // Successfully sets shop metadata URI
      const uri = await publicClient.readContract({
        address: abi.addresses.ShopReg as Address,
        abi: abi.ShopReg,
        functionName: "tokenURI",
        args: [BigInt(shopId)],
      });
      expect(uri).toEqual("/");
    });
  });
});
