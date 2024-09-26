import React from "react";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, act, within } from "@testing-library/react";
import CreateStore from "@/app/create-store/page";
import { createPublicClient, http, Address } from "viem";
import userEvent from "@testing-library/user-event";
import { hardhat } from "viem/chains";
import { randomAddress, zeroAddress } from "@massmarket/utils";
import { render, getStateManager, getWallet } from "./test-utils";
import { ShopCurrencies, ShopId } from "@/types";
import * as abi from "@massmarket/contracts";

const spy = vi.fn(() => {});

beforeEach(async () => {
  //When Store creation is completed successfully, router.push("/products") is called. So we are spying on this mock push fn.
  vi.mock("next/navigation", () => ({
    useRouter() {
      return {
        route: "/",
        push: spy,
      };
    },
    useSearchParams() {
      return {
        get: () => {},
      };
    },
    usePathname() {
      return "/merchants/";
    },
  }));

  vi.mock(import("wagmi"), async (importOriginal) => {
    const mod = await importOriginal(); // type is inferred
    return {
      ...mod,
      useWalletClient() {
        return {
          data: getWallet(),
          status: "success",
        };
      },
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
  const sm = await getStateManager();

  const user = userEvent.setup();
  beforeEach(async () => {
    render(<CreateStore />, sm);
  });

  test("Create store - with auto-filled payee address", async () => {
    await act(async () => {
      const file = new File(["hello"], "hello.png", { type: "image/png" });

      const nameInput = screen.getByTestId(`storeName`);
      const descInput = screen.getByTestId(`desc`);
      const chains = screen.getByRole("checkbox", { name: "ETH/Hardhat" });
      const uploadInput = screen.getByTestId("file-upload");
      const withinPricingCurrency = within(
        screen.getByTestId("pricing-currency"),
      );
      const pricingDropdown = withinPricingCurrency.getByTestId("dropdown");
      const withinPayeeDropdown = within(screen.getByTestId("payee-info"));
      const payeeDropdown = withinPayeeDropdown.getByTestId("dropdown");

      await user.upload(uploadInput, file);
      await user.click(chains);
      await user.clear(nameInput);
      await user.clear(descInput);
      await user.click(pricingDropdown);
      await user.click(payeeDropdown);
      await user.type(nameInput, "New Store Name II");
      await user.type(descInput, "New Store Description II");
      const pricingCurrency = await screen.findByTestId("ETH/Hardhat");
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
      const manifest = await sm.manifest.get();
      const pc = manifest.pricingCurrency as ShopCurrencies;
      //Correctly saves hardhat and zeroAddress in statemanager.
      expect(pc.chainId).toEqual(31337);
      expect(pc.address).toEqual(zeroAddress);
      shopId = manifest.tokenId!;
    });

    await waitFor(async () => {
      const publicClient = createPublicClient({
        chain: hardhat,
        transport: http(),
      });
      const uri = await publicClient.readContract({
        address: abi.addresses.ShopReg as Address,
        abi: abi.ShopReg,
        functionName: "tokenURI",
        args: [BigInt(shopId)],
      });
      expect(uri).toEqual("/");
    });
  });

  test("Create store - with changed payee address and pricing currency", async () => {
    const payee = randomAddress();
    await act(async () => {
      const file = new File(["hello"], "hello.png", { type: "image/png" });

      const nameInput = screen.getByTestId(`storeName`);
      const descInput = screen.getByTestId(`desc`);
      const chains = screen.getByRole("checkbox", { name: "ETH/Hardhat" });
      const uploadInput = screen.getByTestId("file-upload");
      const payeeInput = screen.getByTestId("payeeAddress");
      const withinPricingCurrency = within(
        screen.getByTestId("pricing-currency"),
      );
      const pricingDropdown = withinPricingCurrency.getByTestId("dropdown");
      const withinPayeeDropdown = within(screen.getByTestId("payee-info"));
      const payeeDropdown = withinPayeeDropdown.getByTestId("dropdown");

      await user.upload(uploadInput, file);
      await user.click(chains);
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
    await waitFor(
      async () => {
        await screen.findByTestId("confirmation");

        const manifest = await sm.manifest.get();
        shopId = manifest.tokenId!;
        const { pricingCurrency, payees } = manifest;
        expect(pricingCurrency.address).toEqual(
          //USDC address - since we select USDC/Hardhat above.
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        );
        console.log("here", { payees });
        expect(payees[0].address).toEqual(payee);
        expect(payees[0].chainId).toEqual(31337);
      },
      { timeout: 20000 },
    );
    await waitFor(
      async () => {
        const publicClient = createPublicClient({
          chain: hardhat,
          transport: http(),
        });
        const uri = await publicClient.readContract({
          address: abi.addresses.ShopReg as Address,
          abi: abi.ShopReg,
          functionName: "tokenURI",
          args: [BigInt(shopId)],
        });
        expect(uri).toEqual("/");
      },
      { timeout: 20000 },
    );
  });
});
