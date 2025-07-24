import { useEffect, useState } from "react";
import { getLogger } from "@logtape/logtape";

import { Order, OrderedItem, OrderState } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";
import { randUint64 } from "@massmarket/utils";

import { useStateManager } from "./useStateManager.ts";
/**
 * This hook returns the most recent active order for a shop.
 * Currently, an "active" order is any order that is not cancelled or paid. This definition may change once relay supports unlocking orders.
 * There may be multiple "active" orders associated with a keycard, but since the frontend app only cares about the last active order for now, we just return the latest active order.
 */

const logger = getLogger(["mass-market", "frontend", "useCurrentOrder"]);

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

  async function createOrder(itemId?: number, quantity?: number) {
    const orderId = randUint64();

    const newOrder = new Order(
      orderId,
      itemId ? [new OrderedItem(itemId, quantity)] : [],
      OrderState.Open,
    );
    await stateManager!.set(
      ["Orders", orderId],
      newOrder,
    );
    logger.debug`New Order ID: ${orderId}`;
  }

  async function cancelOrder() {
    logger.debug("Cancelling order");

    await stateManager!.set(
      ["Orders", activeOrder!.ID, "CanceledAt"],
      new Date(),
    );
    await stateManager!.set(
      ["Orders", activeOrder!.ID, "State"],
      OrderState.Canceled,
    );
  }

  async function cancelAndRecreateOrder() {
    logger.debug("Cancelling and recreating order");
    const items = activeOrder?.Items;
    await cancelOrder();
    const newOrderID = randUint64();
    const newOrder = new Order(
      newOrderID,
      items,
      OrderState.Open,
    );

    await stateManager!.set(
      ["Orders", newOrderID],
      newOrder,
    );
    logger.debug("Order recreated.");
    return newOrderID;
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
    cancelOrder,
    createOrder,
    cancelAndRecreateOrder,
  };
}
