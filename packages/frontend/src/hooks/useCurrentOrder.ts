import { useEffect, useState } from "react";
import { toHex } from "viem";

import { logger } from "@massmarket/utils";
import { Order } from "@massmarket/schema";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { KeycardRole, OrderState } from "../types.ts";
import { useShopId } from "./useShopId.ts";
import { useKeycard } from "./useKeycard.ts";
import { useMassMarketContext } from "../MassMarketContext.ts";

const namespace = "frontend:useCurrentOrder";
const errlog = logger(namespace, "error");
const debug = logger(namespace);

export function useCurrentOrder() {
  const { currentOrder, setCurrentOrder } = useMassMarketContext();
  const { clientStateManager } = useClientWithStateManager();
  const { shopId } = useShopId();
  const [keycard] = useKeycard();
  const sm = clientStateManager?.stateManager;

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
        openOrders.push(order);
      } else if (order.State === OrderState.Committed) {
        committedOrders.push(order);
      }
    }

    if (openOrders.length === 1) {
      return openOrders[0];
    } else if (
      openOrders.length > 1 && keycard?.role !== KeycardRole.MERCHANT
    ) {
      //Since merchants are subscribed to all orders, we don't need to worry about multiple open orders.
      errlog("Multiple open orders found");
    } else {
      // If no open order, look for committed order
      debug("No open order found, looking for committed order");

      if (committedOrders.length === 1) {
        return committedOrders[0];
      } else if (committedOrders.length > 1 && keycard?.role !== "merchant") {
        //Since merchants are subscribed to all orders, we don't need to worry about multiple committed orders.
        errlog("Multiple committed orders found");
      } else {
        debug("No order yet");
      }
    }
    return null;
  }

  useEffect(() => {
    if (!sm) return;
    if (!currentOrder) {
      orderFetcher().then((o: Order | null) => {
        if (!o) return;
        sm.events.on(onCurrentOrderChange, ["Orders", o.ID]);
        setCurrentOrder(o);
      });
    }
    return () => {
      if (currentOrder) {
        sm.events.off(onCurrentOrderChange, ["Orders", currentOrder.ID]);
      }
    };
  }, [sm]);
  return { currentOrder };
}
