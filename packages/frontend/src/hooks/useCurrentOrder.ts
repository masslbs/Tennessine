import { useEffect } from "react";
import { getLogger } from "@logtape/logtape";

import { randUint64 } from "@massmarket/utils";
import { Order, OrderedItem } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";

import { useStateManager } from "./useStateManager.ts";
import { ListingId, OrderState } from "../types.ts";
import { useKeycard } from "./useKeycard.ts";
import { useMassMarketContext } from "../MassMarketContext.ts";

const logger = getLogger(["mass-market", "frontend", "useCurrentOrder"]);

export function useCurrentOrder() {
  const { currentOrder, setCurrentOrder } = useMassMarketContext();
  const { stateManager } = useStateManager();
  const { data: keycard } = useKeycard();

  function onCurrentOrderChange(o: CodecValue) {
    if (!stateManager) {
      return;
    }
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

  async function createOrder(itemId?: ListingId, quantity?: number) {
    if (!stateManager) {
      return;
    }
    const orderId = randUint64();
    const newOrder = new Order(
      orderId,
      itemId
        ? [
          new OrderedItem(itemId, Number(quantity)),
        ]
        : [],
      OrderState.Open,
    );
    await stateManager.set(
      ["Orders", orderId],
      newOrder,
    );
    logger.debug`New Order ID: ${orderId}`;
    setCurrentOrder(newOrder);
  }

  async function cancelOrder() {
    if (!stateManager) {
      return;
    }
    logger.debug("Cancelling order");

    await stateManager.set(
      ["Orders", currentOrder!.ID, "CanceledAt"],
      new Date(),
    );
    await stateManager.set(
      ["Orders", currentOrder!.ID, "State"],
      OrderState.Canceled,
    );
  }

  async function cancelAndRecreateOrder() {
    logger.debug("Cancelling and recreating order");
    const items = currentOrder?.Items;
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
    setCurrentOrder(newOrder);
    return newOrderID;
  }

  async function orderFetcher(): Promise<Order | undefined> {
    //TODO: We need a better way of handling current order.
    if (!stateManager) {
      return undefined;
    }

    const allOrders = await stateManager!.get(["Orders"]);
    const openOrders: Order[] = [];
    const committedOrders: Order[] = [];
    const unpaidOrders: Order[] = [];

    if (!allOrders || !(allOrders instanceof Map)) {
      return undefined;
    }

    for (const [_, o] of allOrders.entries()) {
      const order = Order.fromCBOR(o);
      if (order.State === OrderState.Open) {
        openOrders.push(order);
      } else if (order.State === OrderState.Committed) {
        committedOrders.push(order);
      } else if (
        order.State === OrderState.Unpaid ||
        order.State === OrderState.PaymentChosen
      ) {
        unpaidOrders.push(order);
      }
    }

    if (openOrders.length === 1) {
      logger.debug`Found 1 open order: ${openOrders[0].ID}`;
      return openOrders[0];
    }

    if (openOrders.length > 1 && keycard?.role !== "merchant") {
      //Since merchants are subscribed to all orders, we don't need to worry about multiple open orders.
      logger.error("Multiple open orders found");
      return undefined;
    }

    // If no open order, look for committed order
    logger.debug("No open order found, looking for committed order");

    if (committedOrders.length === 1) {
      return committedOrders[0];
    }

    if (committedOrders.length > 1 && keycard?.role !== "merchant") {
      //Since merchants are subscribed to all orders, we don't need to worry about multiple committed orders.
      logger.error("Multiple committed orders found");
    } else {
      logger.debug("No order yet");
    }

    // Look for any unpaid orders (aka orders with InvoiceAddress or/and ChosenCurrency)
    if (unpaidOrders.length > 0) {
      return unpaidOrders[0];
    }
    return undefined;
  }

  useEffect(() => {
    if (!stateManager) return;
    if (!currentOrder) {
      orderFetcher().then((o: Order | undefined) => {
        if (!o) return;
        setCurrentOrder(o);
      });
    }
  }, [stateManager, currentOrder?.ID]);

  useEffect(() => {
    if (!stateManager) return;
    if (currentOrder) {
      stateManager.events.on(onCurrentOrderChange, ["Orders", currentOrder.ID]);
    }
    return () => {
      if (currentOrder) {
        stateManager.events.off(onCurrentOrderChange, [
          "Orders",
          currentOrder.ID,
        ]);
      }
    };
  }, [stateManager, currentOrder?.ID]);
  return { currentOrder, createOrder, cancelAndRecreateOrder, cancelOrder };
}
