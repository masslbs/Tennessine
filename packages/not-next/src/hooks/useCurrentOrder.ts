import { useContext, useEffect } from "react";
import { logger } from "@massmarket/utils";

import { MassMarketContext } from "../MassMarketContext";
import useClientWithStateManager from "./useClientWithStateManager";
import { OrderState } from "@/types";

const namespace = "frontend:useCurrentOrder";
const errlog = logger(namespace, "error");
const debug = logger(namespace);

export default function useCurrentOrder() {
  const { currentOrder, setCurrentOrderId } = useContext(MassMarketContext);
  const { clientStateManager } = useClientWithStateManager();
  const orderManager = clientStateManager.stateManager.orders;

  useEffect(() => {
    (async () => {
      // First try to find an open order
      const openOrders = await orderManager.getStatus(OrderState.STATE_OPEN);

      if (openOrders.length === 1) {
        setCurrentOrderId({
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
        );

        if (committedOrders.length === 1) {
          setCurrentOrderId({
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
    })();
  }, []);

  return { currentOrder, setCurrentOrderId };
}
