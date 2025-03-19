import { assertEquals } from "@std/assert";
import { renderHook, waitFor } from "@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";

import { useCurrentOrder } from "./useCurrentOrder.ts";
import { createRouterWrapper } from "../utils/test.tsx";
import { OrderState } from "../types.ts";

Deno.test(
  "useCurrentOrder",
  { sanitizeResources: false, sanitizeOps: false },
  async (t) => {
    GlobalRegistrator.register({});
    const { wrapper, csm } = await createRouterWrapper();

    await t.step("should return null if no order is found", () => {
      const { result, unmount } = renderHook(() => useCurrentOrder(), {
        wrapper,
      });
      assertEquals(result.current.currentOrder, null);

      unmount();
    });

    await t.step("should return open order", async () => {
      const order = await csm.stateManager?.orders.create();
      const { result, unmount } = renderHook(() => useCurrentOrder(), {
        wrapper,
      });
      await waitFor(() => {
        assertEquals(result.current.currentOrder, {
          orderId: order!.id,
          status: OrderState.STATE_OPEN,
        });
      });

      unmount();
    });
  },
);
