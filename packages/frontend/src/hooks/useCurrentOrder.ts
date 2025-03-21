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
    const order = new Order(o);
    switch (order.State) {
      case OrderState.STATE_CANCELED:
        setCurrentOrder(null);
        break;
      case OrderState.STATE_PAYMENT_TX:
        setCurrentOrder(null);
        break;
      default:
        setCurrentOrder(order);
        break;
    }
  }

  async function orderFetcher() {
    const allOrders = await sm.get(["Orders"]);
    const openOrders = allOrders.filter((o: Map<string, unknown>) =>
      o.get("State") === OrderState.STATE_OPEN
    );
    if (openOrders.length === 1) {
      setCurrentOrder({
        orderId: openOrders[0],
        status: OrderState.STATE_OPEN,
      });
    } else if (
      openOrders.length > 1 && keycard?.role !== KeycardRole.MERCHANT
    ) {
      //Since merchants are subscribed to all orders, we don't need to worry about multiple open orders.
      errlog("Multiple open orders found");
    } else {
      // If no open order, look for committed order
      debug("No open order found, looking for committed order");
      const committedOrders = allOrders.filter((o: Map<string, unknown>) =>
        o.get("State") === OrderState.STATE_COMMITTED
      );

      if (committedOrders.length === 1) {
        setCurrentOrder({
          orderId: committedOrders[0],
          status: OrderState.STATE_COMMITTED,
        });
      } else if (committedOrders.length > 1 && keycard?.role !== "merchant") {
        //Since merchants are subscribed to all orders, we don't need to worry about multiple committed orders.
        errlog("Multiple committed orders found");
      } else {
        debug("No order yet");
      }
    }
  }

  useQuery(async () => {
    if (!sm) return;
    await orderFetcher();
  }, [hexId, sm]);

  useEffect(() => {
    if (!sm || !currentOrder.ID) return;
    sm.events.on(onCurrentOrderChange, ["Orders", currentOrder.orderId]);
    return () => {
      sm.events.off(onCurrentOrderChange, ["Orders", currentOrder.orderId]);
    };
  }, [currentOrder?.ID]);

  return { currentOrder };
}
