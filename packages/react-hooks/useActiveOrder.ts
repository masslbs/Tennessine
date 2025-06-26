import { useEffect, useState } from "react";

import { Order, OrderState } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";

import { useStateManager } from "./useStateManager.ts";

/**
 * This hook returns the most recent active order for a shop.
 * Currently, an "active" order is any order that is not cancelled or paid. This definition may change once relay supports unlocking orders.
 * There may be multiple "active" orders associated with a keycard, but since the frontend app only cares about the last active order for now, we just return the latest active order.
 */
export function useActiveOrder() {
  const { stateManager } = useStateManager();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  function getLastActiveOrder() {
    stateManager!.get(["Orders"]).then((orders: CodecValue | undefined) => {
      if (!(orders instanceof Map) || !orders.size) return;
      const lastUpdatedOrder = [...orders.values()].pop();
      const order = Order.fromCBOR(lastUpdatedOrder!);
      if (
        order.State !== OrderState.Canceled && order.State !== OrderState.Paid
      ) {
        setActiveOrder(order);
      }
    });
  }

  useEffect(() => {
    if (!stateManager) return;

    getLastActiveOrder();
    stateManager.events.on(getLastActiveOrder, ["Orders"]);
    return () => {
      stateManager.events.off(getLastActiveOrder, ["Orders"]);
    };
  }, [stateManager]);

  return {
    activeOrder,
  };
}
