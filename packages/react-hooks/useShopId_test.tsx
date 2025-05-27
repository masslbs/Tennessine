import { register, unregister } from "./happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { random256BigInt } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { createWrapper } from "./_createWrapper.tsx";
import { act, renderHook } from "@testing-library/react";

Deno.test(
  "useShopId",
  async (t) => {
    register();
    await t.step("should return shopId from search params", async () => {
      const shopId = random256BigInt();
      let result;
      await act(() => {
        const { result: r } = renderHook(() => useShopId(), {
          wrapper: createWrapper(shopId),
        });
        result = r;
      });
      assertEquals(result!.current.shopId, shopId);
    });
    await unregister();
  },
);
