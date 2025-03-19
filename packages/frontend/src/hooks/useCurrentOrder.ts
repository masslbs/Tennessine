import { useEffect, useState } from "react";

import { logger } from "@massmarket/utils";
import { Order } from "@massmarket/schema";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { CurrentOrder, OrderEventTypes, OrderState } from "../types.ts";
import { useShopId } from "./useShopId.ts";
import { useKeycard } from "./useKeycard.ts";

const namespace = "frontend:useCurrentOrder";
const errlog = logger(namespace, "error");
const debug = logger(namespace);

export function useCurrentOrder() {
  const { clientStateManager } = useClientWithStateManager();
  const { shopId } = useShopId();
  const [keycard] = useKeycard();
  const [currentOrder, setCurrentOrder] = useState<CurrentOrder | null>(null);
  const orderManager = clientStateManager?.stateManager?.orders;

  function onOrderCreate(o: Map<string, unknown>) {
    const order = new Order(o);
    if (order.State === OrderState.STATE_OPEN) {
      setCurrentOrder({ orderId: order.ID, status: OrderState.STATE_OPEN });
    }
  }

  function onOrderUpdate(res: [OrderEventTypes, Map<string, unknown>]) {
    const order = new Order(res[1]);
    const type = res[0];

    switch (type) {
      case OrderEventTypes.CANCELLED:
        orderCancel(order);
        break;
      case OrderEventTypes.PAYMENT_TX:
        txHashDetected(order);
        break;
      case OrderEventTypes.COMMIT_ITEMS:
        onCommit(order);
        break;
      default:
        break;
    }
  }

  function onCommit(o: Map<string, unknown>) {
    const order = new Order(o);
    if (order.State === OrderState.STATE_COMMITTED) {
      setCurrentOrder({
        orderId: order.ID,
        status: OrderState.STATE_COMMITTED,
      });
    }
  }
  function txHashDetected(o: Map<string, unknown>) {
    const order = new Order(o);
    if (order.State === OrderState.STATE_PAYMENT_TX) {
      setCurrentOrder(null);
    }
  }

  function orderCancel(o: Map<string, unknown>) {
    const order = new Order(o);
    if (order.State === OrderState.STATE_CANCELED) {
      setCurrentOrder(null);
    }
  }

  async function orderFetcher() {
    // First try to find an open order
    const openOrders = await orderManager.getStatus(OrderState.STATE_OPEN) ||
      [];
    if (openOrders.length === 1) {
      setCurrentOrder({
        orderId: openOrders[0],
        status: OrderState.STATE_OPEN,
      });
      return;
    } else if (openOrders.length > 1 && keycard?.role !== "merchant") {
      //Since merchants are subscribed to all orders, we don't need to worry about multiple open orders.
      errlog("Multiple open orders found");
      return;
    } else {
      // If no open order, look for committed order
      debug("No open order found, looking for committed order");
      const committedOrders = await orderManager.getStatus(
        OrderState.STATE_COMMITTED,
      ) || [];

      if (committedOrders.length === 1) {
        setCurrentOrder({
          orderId: committedOrders[0],
          status: OrderState.STATE_COMMITTED,
        });
        return;
      } else if (committedOrders.length > 1 && keycard?.role !== "merchant") {
        //Since merchants are subscribed to all orders, we don't need to worry about multiple open orders.
        errlog("Multiple committed orders found");
        return;
      } else {
        debug("No order yet");
        return;
      }
    }
  }

  useEffect(() => {
    if (!orderManager) return;
    orderManager.on("create", onOrderCreate);
    orderManager.on("update", onOrderUpdate);
    orderFetcher().then();
    return () => {
      orderManager.removeListener("create", onOrderCreate);
      orderManager.removeListener("update", onOrderUpdate);
    };
  }, [shopId, orderManager]);

  return { currentOrder };
}
