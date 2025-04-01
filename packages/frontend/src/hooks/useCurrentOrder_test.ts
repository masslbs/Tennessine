import "../happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { renderHook, waitFor } from "@testing-library/react";

import { Order } from "@massmarket/schema";

import { useCurrentOrder } from "./useCurrentOrder.ts";
import { createRouterWrapper } from "../testutils/mod.tsx";
import { OrderState } from "../types.ts";

Deno.test(
  "useCurrentOrder",
  { sanitizeResources: false, sanitizeOps: false },
  async (t) => {
    const { wrapper, stateManager } = await createRouterWrapper({
      createShop: true,
      enrollKeycard: true,
    });

    await t.step("should return null if no order is found", () => {
      const { result, unmount } = renderHook(() => useCurrentOrder(), {
        wrapper,
      });
      assertEquals(result.current.currentOrder, null);

      unmount();
    });

    await t.step("should return open order", async () => {
      const order = new Order(12);
      order.State = OrderState.Open;
      // @ts-ignore TODO: add BaseClass to CodecValue
      await stateManager.set(["Orders", order.ID], order);
      const { result, unmount } = renderHook(() => useCurrentOrder(), {
        wrapper,
      });

      await waitFor(() => {
        const { currentOrder } = result.current;
        assertEquals(currentOrder?.ID, order.ID);
        assertEquals(currentOrder?.State, OrderState.Open);
      });

      unmount();
    });
  },
);
