import { useEffect, useState } from "react";
import { logger } from "@massmarket/utils";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { CurrentOrder, Order, OrderEventTypes, OrderState } from "../types.ts";
import { useShopId } from "./useShopId.ts";

const namespace = "frontend:useCurrentOrder";
const errlog = logger(namespace, "error");
const debug = logger(namespace);

export function useCurrentOrder() {
  const { clientStateManager } = useClientWithStateManager();
  const { shopId } = useShopId();
  const [currentOrder, setCurrentOrder] = useState<CurrentOrder | null>(null);
  const [orderFetched, setOrderFetched] = useState<boolean>(false);
  const orderManager = clientStateManager?.stateManager?.orders;

  function onOrderCreate(order: Order) {
    if (order.status === OrderState.STATE_OPEN) {
      setCurrentOrder({ orderId: order.id, status: OrderState.STATE_OPEN });
    }
  }
  function onOrderUpdate(res: [OrderEventTypes, Order]) {
    const order = res[1];
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
    }
  }

  function onCommit(order: Order) {
    if (order.status === OrderState.STATE_COMMITED) {
      setCurrentOrder({
        orderId: order.id,
        status: OrderState.STATE_COMMITED,
      });
    }
  }
  function txHashDetected(order: Order) {
    if (order.status === OrderState.STATE_PAYMENT_TX) {
      setCurrentOrder(null);
    }
  }

  function orderCancel(order: Order) {
    if (order.status === OrderState.STATE_CANCELED) {
      setCurrentOrder(null);
    }
  }

  async function orderFetcher() {
    // First try to find an open order
    const openOrders = await orderManager.getStatus(OrderState.STATE_OPEN) ||
      [];
    console.log({ openOrders });
    if (openOrders.length === 1) {
      setCurrentOrder({
        orderId: openOrders[0],
        status: OrderState.STATE_OPEN,
      });
      return;
    } else if (openOrders.length > 1) {
      errlog("Multiple open orders found");
      return;
    } else {
      // If no open order, look for committed order
      debug("No open order found, looking for committed order");
      const committedOrders = await orderManager.getStatus(
        OrderState.STATE_COMMITED,
      ) || [];

      if (committedOrders.length === 1) {
        setCurrentOrder({
          orderId: committedOrders[0],
          status: OrderState.STATE_COMMITED,
        });
        return;
      } else if (committedOrders.length > 1) {
        errlog("Multiple committed orders found");
        return;
      } else {
        debug("No order yet");
        return;
      }
    }
  }

  useEffect(() => {
    //FIXME: wrap around useQuery
    if (!orderManager) return;
    orderFetcher()
      .finally(() => {
        setOrderFetched(true);
      })
      .catch((e) => {
        errlog(e);
      });
    orderManager.on("create", onOrderCreate);
    orderManager.on("update", onOrderUpdate);
    return () => {
      orderManager.removeListener("create", onOrderCreate);
      orderManager.removeListener("update", onOrderUpdate);
    };
  }, [shopId]);

  return { currentOrder, orderFetched };
}
