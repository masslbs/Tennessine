import "../../happyDomSetup.ts";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";

import { random256BigInt } from "@massmarket/utils";
import { mintShop, setTokenURI } from "@massmarket/contracts";

import MerchantConnect from "./MerchantConnect.tsx";
import {
  createRouterWrapper,
  testAccount,
  testClient,
} from "../../testutils/mod.tsx";
import { toHex } from "viem";

Deno.test("Check that we can render the merchant connect screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const shopId = random256BigInt();

  const { wrapper } = await createRouterWrapper({
    shopId,
    enrollMerchant: false,
    path: "/merchant-connect",
  });

  await t.step("Render and unmount component", async () => {
    const { unmount } = render(<MerchantConnect />, { wrapper });
    await screen.findByTestId("merchant-connect-page");
    expect(screen.getByTestId("merchant-connect-page")).toBeTruthy();
    unmount();
  });

  await t.step("should be able to search for existing shop", async () => {
    const transactionHash = await mintShop(testClient, testAccount, [
      shopId,
      testAccount,
    ]);
    const receipt = await testClient.waitForTransactionReceipt({
      hash: transactionHash,
    });
    expect(receipt.status).toBe("success");

    const metadataHash = await setTokenURI(testClient!, testAccount, [
      shopId!,
      "https://dummyjson.com/c/0a7c-cc65-4739-8899",
    ]);
    const transaction = await testClient!.waitForTransactionReceipt({
      hash: metadataHash,
      retryCount: 10,
    });
    expect(transaction.status).toBe("success");
  });

  // TODO: for some reason, making these three steps introduces problems
  await t.step("Test different shop ids", async () => {
    const { unmount } = render(<MerchantConnect />, { wrapper });
    const user = userEvent.setup();
    await act(async () => {
      const searchInput = await screen.findByTestId("search-shopId");
      expect(searchInput).toBeTruthy();
      await user.clear(searchInput);
      await user.type(searchInput, `Hello, world!`);
    });
    await act(async () => {
      const searchButton = screen.getByRole("button", {
        name: "Search for shop",
      });
      expect(searchButton).toBeTruthy();
      await user.click(searchButton);
    });
    await waitFor(() => {
      const errorMessage = screen.getByTestId("error-message") as HTMLElement;
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toBe("Invalid shop ID (input not hex)");
    });

    const testShopId = toHex(random256BigInt(), { size: 32 });
    await act(async () => {
      const searchInput = screen.getByTestId("search-shopId");
      expect(searchInput).toBeTruthy();
      await user.clear(searchInput);
      await user.type(searchInput, testShopId);
    });
    await act(async () => {
      const searchButton = screen.getByRole("button", {
        name: "Search for shop",
      });
      expect(searchButton).toBeTruthy();
      await user.click(searchButton);
    });
    await waitFor(() => {
      const errorMessage = screen.getByTestId("error-message") as HTMLElement;
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toBe("Shop not found");
    });

    await act(async () => {
      const searchInput = screen.getByTestId("search-shopId");
      expect(searchInput).toBeTruthy();
      await user.clear(searchInput);
      await user.type(searchInput, `0x${shopId.toString(16)}`);
    });
    await act(async () => {
      const searchButton = screen.getByRole("button", {
        name: "Search for shop",
      });
      expect(searchButton).toBeTruthy();
      await user.click(searchButton);
    });
    await waitFor(async () => {
      expect(screen.getByTestId("shop-name")).toBeTruthy();
      const searchButton = screen.getByRole("button", {
        name: "Connect to shop",
      });
      expect(searchButton).toBeTruthy();
      await user.click(searchButton);
    }, { timeout: 10000 });
    await waitFor(() => {
      expect(screen.getByTestId("connect-confirmation")).toBeTruthy();
    });
    unmount();
  });
  cleanup();
});
