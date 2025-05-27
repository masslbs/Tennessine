import "../happyDomSetup.ts";
import { assertEquals, fail } from "@std/assert";
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
      enrollMerchant: true,
    });

    await t.step("should return null if no order is found", () => {
      const { result, unmount } = renderHook(() => {
        return useCurrentOrder();
      }, {
        wrapper,
      });

      if (result.current === null) {
        console.error("Hook returned null - this should not happen");
      } else if (result.current && typeof result.current === "object") {
        assertEquals(result.current.currentOrder, null);
      } else {
        console.error("Unexpected result.current:", result.current);
        fail();
      }
      unmount();
    });

    await t.step("should return open order", async () => {
      const order = new Order(12);
      order.State = OrderState.Open;
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
