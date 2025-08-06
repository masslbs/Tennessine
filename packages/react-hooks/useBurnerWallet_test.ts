import { register, unregister } from "./happyDomSetup.ts";
import { random256BigInt } from "@massmarket/utils";
import { expect } from "@std/expect";

import { useBurnerWallet } from "./useBurnerWallet.ts";
import { createWrapper } from "./_createWrapper.tsx";
import { cleanup, renderHook, waitFor } from "@testing-library/react";

Deno.test(
  "useBurnerWallet",
  async (t) => {
    register();
    await t.step("Should return burner wallet and account", async () => {
      const shopId = random256BigInt();
      const { result } = renderHook(() => useBurnerWallet(), {
        wrapper: createWrapper(shopId),
      });
      await waitFor(() => {
        expect(result!.current.burnerAccount).toBeDefined();
        expect(result!.current.burnerWallet).toBeDefined();
      });
    });
    cleanup();
    await unregister();
  },
);
