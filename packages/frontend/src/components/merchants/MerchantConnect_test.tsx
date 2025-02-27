import "../../happyDomSetup.ts";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import { userEvent } from "@testing-library/user-event";
import { expect } from "jsr:@std/expect";

import { random256BigInt, random32BytesHex } from "@massmarket/utils";
import { mintShop, setTokenURI } from "@massmarket/blockchain";

import MerchantConnect from "./MerchantConnect.tsx";
import { createRouterWrapper, testClient } from "../../utils/test.tsx";

Deno.test("Check that we can render the merchant connect screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const shopId = random256BigInt();
  const user = userEvent.setup();
  const privateKey = random32BytesHex();

  const { wrapper, csm } = await createRouterWrapper(
    shopId,
    "/merchant-connect",
  );
  csm.keycard = privateKey;

  await t.step("Render and unmount component", () => {
    const { unmount } = render(<MerchantConnect />, { wrapper });
    screen.getByTestId("merchant-connect-page");
    expect(screen.getByTestId("merchant-connect-page")).toBeTruthy();
    unmount();
  });
  await t.step("should be able to search for existing shop", async () => {
    const transactionHash = await mintShop(testClient, [
      shopId,
      testClient.account.address,
    ]);
    const receipt = await testClient.waitForTransactionReceipt({
      hash: transactionHash,
    });
    expect(receipt.status).toBe("success");

    const metadataHash = await setTokenURI(testClient!, [
      shopId!,
      "https://dummyjson.com/c/0a7c-cc65-4739-8899",
    ]);
    const transaction = await testClient!.waitForTransactionReceipt({
      hash: metadataHash,
      retryCount: 10,
    });

    expect(transaction.status).toBe("success");
    const { unmount } = render(<MerchantConnect />, { wrapper });
    const merchantKeycard = JSON.parse(
      localStorage.getItem(`keycard${shopId}`) || "{}",
    );
    csm.keycard = merchantKeycard!.privateKey;

    // Test invalid shop id
    await act(async () => {
      const searchInput = screen.getByTestId("search-shopId");
      expect(searchInput).toBeTruthy();
      await user.type(searchInput, `0x${random256BigInt().toString(16)}`);
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

    // Test valid shop id
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
    });
    await waitFor(() => {
      expect(screen.getByTestId("connect-confirmation")).toBeTruthy();
    });
    unmount();
  });
  cleanup();
});
