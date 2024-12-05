// import { useContext, useEffect } from "react";
// import { logger } from "@massmarket/utils";

// import { MassMarketContext } from "../MassMarketContext";
// import useClientWithStateManager from "./useClientWithStateManager";
// import { Order, OrderEventTypes, OrderState } from "@/types";

// const namespace = "frontend:useCurrentOrder";
// const errlog = logger(namespace, "error");
// const debug = logger(namespace);

// export default function useCurrentOrder() {
//   const { currentOrder, setCurrentOrderId } = useState(MassMarketContext);
//   const { clientStateManager } = useClientWithStateManager();
//   const orderManager = clientStateManager.stateManager.orders;

//   function onOrderCreate(order: Order) {
//     if (order.status === OrderState.STATE_OPEN) {
//       setCurrentOrderId({ orderId: order.id, status: OrderState.STATE_OPEN });
//     }
//   }
//   function onOrderUpdate(res: [OrderEventTypes, Order]) {
//     const order = res[1];
//     const type = res[0];

//     switch (type) {
//       case OrderEventTypes.CANCELLED:
//         orderCancel(order);
//         break;
//       case OrderEventTypes.PAYMENT_TX:
//         txHashDetected(order);
//         break;
//       case OrderEventTypes.COMMIT_ITEMS:
//         onCommit(order);
//         break;
//     }
//   }

//   function onCommit(order: Order) {
//     if (order.status === OrderState.STATE_COMMITED) {
//       setCurrentOrderId({
//         orderId: order.id,
//         status: OrderState.STATE_COMMITED,
//       });
//     }
//   }
//   function txHashDetected(order: Order) {
//     if (order.status === OrderState.STATE_PAYMENT_TX) {
//       setCurrentOrderId(null);
//     }
//   }

//   function orderCancel(order: Order) {
//     if (order.status === OrderState.STATE_CANCELED) {
//       setCurrentOrderId(null);
//     }
//   }

//   useEffect(() => {
//     async function orderFetcher() {
//       // First try to find an open order
//       const openOrders = await orderManager.getStatus(OrderState.STATE_OPEN);

//       if (openOrders.length === 1) {
//         setCurrentOrderId({
//           orderId: openOrders[0],
//           status: OrderState.STATE_OPEN,
//         });
//         return;
//       } else if (openOrders.length > 1) {
//         errlog("Multiple open orders found");
//         return;
//       } else {
//         // If no open order, look for committed order
//         debug("No open order found, looking for committed order");
//         const committedOrders = await orderManager.getStatus(
//           OrderState.STATE_COMMITED,
//         );

//         if (committedOrders.length === 1) {
//           setCurrentOrderId({
//             orderId: committedOrders[0],
//             status: OrderState.STATE_COMMITED,
//           });
//           return;
//         } else if (committedOrders.length > 1) {
//           errlog("Multiple committed orders found");
//           return;
//         } else {
//           debug("No order yet");
//           return;
//         }
//       }
//     });
//   const promise = orderFetcher();
//   promise.final(() => setIsDone(true)).catch((e) => setError(e))
//     orderManager.on("create", onOrderCreate);
//     orderManager.on("update", onOrderUpdate);

//     return () => {
//       orderManager.removeListener("create", onOrderCreate);
//       orderManager.removeListener("update", onOrderUpdate);
//     }} []);

//   return { currentOrder, setCurrentOrderId };
// }
