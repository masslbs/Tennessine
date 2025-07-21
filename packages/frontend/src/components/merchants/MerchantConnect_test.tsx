import "../../happyDomSetup.ts";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { toHex } from "viem";

import { random256BigInt } from "@massmarket/utils";
import { setTokenURI } from "@massmarket/contracts";

import MerchantConnect from "./MerchantConnect.tsx";
import {
  createWrapper,
  denoTestOptions,
  testAccount,
  testClient,
  testWrapper,
} from "../../testutils/_createWrapper.tsx";

Deno.test(
  "Merchant Connect",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const user = userEvent.setup();

    await t.step("Set shop metadata", async () => {
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

    await t.step(
      "Display error message for invalid shop ID inputs",
      async () => {
        const wrapper = await createWrapper(null, "/merchant-connect");
        const { unmount } = render(<MerchantConnect />, { wrapper });
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
          const errorMessage = screen.getByTestId(
            "error-message",
          ) as HTMLElement;
          expect(errorMessage).toBeTruthy();
          expect(errorMessage.textContent).toBe("Invalid shop ID");
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
          const errorMessage = screen.getByTestId(
            "error-message",
          ) as HTMLElement;
          expect(errorMessage).toBeTruthy();
          expect(errorMessage.textContent).toBe("Shop not found");
        });

        unmount();
      },
    );

    await t.step("Connect to shop with valid shop ID", async () => {
      const wrapper = await createWrapper(null, "/merchant-connect");
      const { unmount } = render(<MerchantConnect />, { wrapper });

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
      await waitFor(() => {
        expect(screen.getByTestId("shop-name")).toBeTruthy();
      });

      const searchButton = screen.getByRole("button", {
        name: "Connect to shop",
      });
      expect(searchButton).toBeTruthy();
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId("connect-confirmation")).toBeTruthy();
      });
      unmount();
    });

    await t.step(
      "Connect to shop with shop ID with fixed shop ID",
      async () => {
        // Passing shopId in createWrapper will set id in param
        const wrapper = await createWrapper(shopId, "/merchant-connect");

        const { unmount } = render(<MerchantConnect />, { wrapper });
        await waitFor(() => {
          expect(screen.getByTestId("shop-name")).toBeTruthy();
        });
        const searchButton = screen.getByRole("button", {
          name: "Connect to shop",
        });
        expect(searchButton).toBeTruthy();
        await user.click(searchButton);
        await waitFor(() => {
          expect(screen.getByTestId("connect-confirmation")).toBeTruthy();
        });
        unmount();
      },
    );
    cleanup();
  }),
);
