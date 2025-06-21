import { useEffect, useState } from "react";

import { Order, OrderState } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";

import { useStateManager } from "./useStateManager.ts";

export function useCurrentOrder() {
  const { stateManager } = useStateManager();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  function getLastActiveOrder() {
    stateManager!.get(["Orders"]).then((orders: CodecValue | undefined) => {
      if (!(orders instanceof Map)) return;
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
