import { useEffect } from "react";

import { logger, randUint64 } from "@massmarket/utils";
import { Order, OrderedItem } from "@massmarket/schema";

import { useStateManager } from "./useStateManager.ts";
import { KeycardRole, OrderState } from "../types.ts";
import { useKeycard } from "./useKeycard.ts";
import { useMassMarketContext } from "../MassMarketContext.ts";

const namespace = "frontend:useCurrentOrder";
const errlog = logger(namespace, "error");
const info = logger(namespace, "info");
const debug = logger(namespace);

export function useCurrentOrder() {
  const { currentOrder, setCurrentOrder } = useMassMarketContext();
  const { stateManager } = useStateManager();
  const [keycard] = useKeycard();

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

  async function createOrder(itemId, quantity) {
    const orderId = randUint64();
    const newOrder = new Order(
      orderId,
      [
        new OrderedItem(itemId, Number(quantity)),
      ],
      OrderState.Open,
    );
    await stateManager.set(
      ["Orders", orderId],
      // @ts-ignore TODO: add BaseClass to CodecValue
      newOrder,
    );
    debug(`New Order ID: ${orderId}`);
    setCurrentOrder(newOrder);
  }

  async function orderFetcher() {
    const allOrders = await stateManager!.get(["Orders"]);
    const openOrders: Order[] = [];
    const committedOrders: Order[] = [];

    if (!allOrders || !(allOrders instanceof Map)) {
      return null;
    }

    for (const [_, o] of allOrders.entries()) {
      const order = Order.fromCBOR(o as Map<string, unknown>);
      if (order.State === OrderState.Open) {
        openOrders.push(order);
      } else if (order.State === OrderState.Committed) {
        committedOrders.push(order);
      }
    }

    if (openOrders.length === 1) {
      info(`Found 1 open order: ${openOrders[0].ID}`);
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
        info("No order yet");
      }
    }
    return null;
  }

  useEffect(() => {
    if (!stateManager) return;
    if (!currentOrder) {
      orderFetcher().then((o: Order | null) => {
        if (!o) return;
        stateManager.events.on(onCurrentOrderChange, ["Orders", o.ID]);
        setCurrentOrder(o);
      });
    }
    return () => {
      if (currentOrder) {
        stateManager.events.off(onCurrentOrderChange, [
          "Orders",
          currentOrder.ID,
        ]);
      }
    };
  }, [stateManager]);
  return { currentOrder, createOrder };
}
