import { renderHook, waitFor } from "@testing-library/react";

import { expect } from "@std/expect";
import { hardhat } from "viem/chains";

import {
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";
import { useShopChain } from "./useShopChain.tsx";

Deno.test(
  "useShopChain",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("Hook returns the correct chain", async () => {
      const { result, unmount } = renderHook(
        () => useShopChain(),
        {
          wrapper: createWrapper(shopId),
        },
      );
      await waitFor(() => {
        expect(result.current.chain.id).toEqual(hardhat.id);
      });
      unmount();
    });
  }),
);
