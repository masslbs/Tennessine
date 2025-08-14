import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { hardhat } from "viem/chains";

import {
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";
import { useShopPublicClient } from "./useShopPublicClient.ts";

Deno.test(
  "useShopChain",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("Hook returns the correct chain", async () => {
      const { result, unmount } = renderHook(
        () => useShopPublicClient(),
        {
          wrapper: createWrapper(shopId),
        },
      );
      await waitFor(() => {
        // expect(result.current.chain).toBeDefined();
        expect(result.current.shopPublicClient).toBeDefined();
        expect(result.current.shopPublicClient!.chain!.id).toEqual(hardhat.id);
      });
      unmount();
    });
  }),
);
