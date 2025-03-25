import { useEffect, useState } from "react";
import { toHex } from "viem";

import { logger } from "@massmarket/utils";
import { Order } from "@massmarket/schema";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { KeycardRole, OrderState } from "../types.ts";
import { useShopId } from "./useShopId.ts";
import { useKeycard } from "./useKeycard.ts";
import { useQuery } from "./useQuery.ts";

const namespace = "frontend:useCurrentOrder";
const errlog = logger(namespace, "error");
const debug = logger(namespace);

export function useCurrentOrder() {
  const { clientStateManager } = useClientWithStateManager();
  const { shopId } = useShopId();
  const [keycard] = useKeycard();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const sm = clientStateManager?.stateManager;
  // bigint cannot be serialized so we convert to hex
  const hexId = shopId ? toHex(shopId) : null;

  function onCurrentOrderChange(o: Map<string, unknown>) {
    const order = Order.fromCBOR(o);
    switch (order.State) {
      case OrderState.Canceled:
        setCurrentOrder(null);
        break;
      case OrderState.Paid:
        setCurrentOrder(null);
        break;
      default:
        setCurrentOrder(order);
        break;
    }
  }

  async function orderFetcher() {
    const allOrders = await sm!.get(["Orders"]);
    const openOrders: Order[] = [];
    const committedOrders: Order[] = [];

    for (const [_, o] of allOrders.entries()) {
      const order = Order.fromCBOR(o);
      if (order.State === OrderState.Open) {
        openOrders.push(o);
      } else if (order.State === OrderState.Committed) {
        committedOrders.push(o);
      }
    }

    if (openOrders.length === 1) {
      setCurrentOrder({
        orderId: openOrders[0],
        status: OrderState.Open,
      });
    } else if (
      openOrders.length > 1 && keycard?.role !== KeycardRole.MERCHANT
    ) {
      //Since merchants are subscribed to all orders, we don't need to worry about multiple open orders.
      errlog("Multiple open orders found");
    } else {
      // If no open order, look for committed order
      debug("No open order found, looking for committed order");

      if (committedOrders.length === 1) {
        setCurrentOrder({
          orderId: committedOrders[0],
          status: OrderState.Committed,
        });
      } else if (committedOrders.length > 1 && keycard?.role !== "merchant") {
        //Since merchants are subscribed to all orders, we don't need to worry about multiple committed orders.
        errlog("Multiple committed orders found");
      } else {
        debug("No order yet");
      }
    }
  }

  // useQuery(async () => {
  //   if (!sm) return;
  //   await orderFetcher();
  // }, [hexId, sm]);

  useEffect(() => {
    if (!sm || !currentOrder) return;
    sm.events.on(onCurrentOrderChange, ["Orders", currentOrder.ID]);
    return () => {
      sm.events.off(onCurrentOrderChange, ["Orders", currentOrder.ID]);
    };
  }, [currentOrder]);

  return { currentOrder };
}
