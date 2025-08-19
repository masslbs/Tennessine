import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { balanceOf, setTokenURI } from "@massmarket/contracts";

import {
  createWrapper,
  denoTestOptions,
  testClient,
  testWrapper,
} from "./_createWrapper.tsx";
import { useMyShops } from "./useMyShops.ts";

Deno.test(
  "useMyShops",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    let balance: bigint;
    await t.step("Hook returns the correct data", async () => {
      const testAccounts = await testClient.requestAddresses();
      const metadataHash = await setTokenURI(testClient!, testAccounts[3], [
        shopId!,
        "https://dummyjson.com/c/0a7c-cc65-4739-8899",
      ]);
      const transaction = await testClient!.waitForTransactionReceipt({
        hash: metadataHash,
        retryCount: 10,
      });
      expect(transaction.status).toBe("success");
      balance = await balanceOf(testClient, [testAccounts[3]]);
    });
    await t.step("Hook returns the correct data", async () => {
      const { result, unmount } = renderHook(
        () => useMyShops(),
        {
          wrapper: createWrapper(shopId, 3),
        },
      );
      await waitFor(() => {
        expect(result.current.shops).toBeDefined();
        expect(result.current.shops!.length).toEqual(Number(balance));
        expect(result.current.shops![Number(balance) - 1].name).toEqual(
          "shopName",
        );
      }, { timeout: 10000 });
      unmount();
    });
  }, 3),
);
