import { renderHook, waitFor } from "@testing-library/react";

import { expect } from "@std/expect";

import { setTokenURI } from "@massmarket/contracts";

import {
  createWrapper,
  denoTestOptions,
  testAccount,
  testClient,
  testWrapper,
} from "./_createWrapper.tsx";
import { useShopDetails } from "./useShopDetails.ts";

Deno.test(
  "useShopDetails",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("Hook returns the correct data", async () => {
      const metadataHash = await setTokenURI(testClient!, testAccount, [
        shopId!,
        "https://dummyjson.com/c/0a7c-cc65-4739-8899",
      ]);
      const transaction = await testClient!.waitForTransactionReceipt({
        hash: metadataHash,
        retryCount: 10,
      });
      expect(transaction.status).toBe("success");
      const { result, unmount } = renderHook(
        () => useShopDetails(),
        {
          wrapper: createWrapper(shopId),
        },
      );
      await waitFor(() => {
        expect(result.current.shopDetails?.name!).toEqual("shopName");
        expect(result.current.shopDetails?.profilePictureUrl!).toEqual(
          "https://http.cat/images/201.jpg",
        );
      });
      unmount();
    });
  }),
);
