// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import {
  Item,
  Relay,
  Order,
  KeyCard,
  ShopManifest,
  Tag,
  ShopCurrencies,
} from "@/types";
import { useMyContext } from "./MyContext";
import { StoreContent, OrderId } from "@/context/types";
import { orderReducer, OrderState } from "@/reducers/orderReducers";
import { initialStoreContext } from "../context/initialLoadingState";
import { dummyRelays } from "./dummyData";
import { pubKeyReducer } from "@/reducers/KCPubKeysReducers";
import { StateManager } from "@massmarket/stateManager";
// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>(initialStoreContext);

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [orderItems, setOrderItems] = useReducer(orderReducer, new Map());
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [erc20Addr, setErc20Addr] = useState<null | `0x${string}`>(null);

  const [pubKeys] = useReducer(pubKeyReducer, []);
  const [relays, setRelays] = useState<Relay[]>(dummyRelays);
  const [selectedCurrency, setSelectedCurrency] =
    useState<ShopCurrencies | null>(null);
  const { relayClient, getTokenInformation, shopId } = useMyContext();
  const [stateManager, setStateManager] = useState<StateManager | null>(null);

  useEffect(() => {
    if (relayClient) {
      (async () => {
        const { Level } = await import("level");
        const dbName = shopId?.slice(0, 7);
        console.log("using level db:", { dbName });
        const db = new Level(`./${dbName}`, {
          valueEncoding: "json",
        });
        // Set up all the stores via sublevel
        const listingStore = db.sublevel<string, Item>("listingStore", {
          valueEncoding: "json",
        });
        const tagStore = db.sublevel<string, Tag>("tagStore", {
          valueEncoding: "json",
        });
        const shopManifestStore = db.sublevel<string, ShopManifest>(
          "shopManifestStore",
          {
            valueEncoding: "json",
          },
        );
        const orderStore = db.sublevel<string, Order>("orderStore", {
          valueEncoding: "json",
        });

        const keycardStore = db.sublevel<string, KeyCard>("keycardStore", {
          valueEncoding: "json",
        });
        //instantiate stateManager and set it in context
        const stateManager = new StateManager(
          relayClient,
          listingStore,
          tagStore,
          shopManifestStore,
          orderStore,
          keycardStore,
        );
        setStateManager(stateManager);

        //close db connection on unload
        if (window && db) {
          window.addEventListener("beforeunload", () => {
            console.log("closing db connection");
            db.close();
          });
        }
      })();
    }
  }, [relayClient]);

  // useEffect(() => {
  //   (async () => {
  //     const currencies = Array.from([...acceptedCurrencies.keys()]);
  //     const _cur = currencies.filter((a) => !acceptedCurrencies.get(a));
  //     _cur.map(async (address) => {
  //       const { symbol } = await getTokenInformation(address);

  //       setAcceptedCurrencies({
  //         type: UPDATE_SYMBOL,
  //         payload: { tokenAddr: address, symbol },
  //       });
  //     });
  //   })();
  // }, [acceptedCurrencies]);

  const verify = async (
    _orderItems: Map<OrderId, OrderState>,
    _pubKeys: `0x${string}`[],
  ) => {
    console.log(_orderItems, _pubKeys);
    // const addresses = _pubKeys.map((k) => {
    //   return Address.fromPublicKey(hexToBytes(k)).toString();
    // });
    // const keysArr: `0x${string}`[] = _orderItems.size
    //   ? Array.from([..._orderItems.keys()])
    //   : [];
    // for (const _orderId of keysArr) {
    //   const _order = _orderItems.get(_orderId) as OrderState;
    //   if (_order && _order.status !== Status.Failed) {
    //     const sig = _order.signature as `0x${string}`;
    //     const retrievedAdd = await relayClient!.recoverSignedAddress(
    //       _orderId,
    //       sig,
    //     );
    //     if (addresses.includes(retrievedAdd.toLowerCase())) {
    //       console.log("inside inclue", _orderId);
    //       setOrderId(_orderId);
    //     }
    //   }
    // }
  };

  // const updateOrder = async (itemId?: ItemId, saleQty: number = 0) => {
  //   try {
  //     const activeOrderItems =
  //       (order_id && (await stateManager.orders.get(order_id)).items) || {};

  //     if (!itemId) {
  //       //Clear order and set every item in order to quantity 0
  //       const itemIds = Object.keys(activeOrderItems) as ItemId[];
  //       for (const id of itemIds) {
  //         await stateManager.orders.changeItems(order_id, id, 0);
  //       }
  //     } else if (saleQty === 0) {
  //       //delete it from orderItems
  //       await relayClient!.updateOrder({
  //         order: hexToBytes(order_id),
  //         changeItems: { itemId: hexToBytes(itemId), quantity: saleQty },
  //       });
  //     } else {
  //       //update item sale qty
  //       // const difference = (activeOrderItems?.[itemId] || 0) - Number(saleQty);
  //       // updateUnitChnage(itemId, difference);
  //     }
  //     return { error: null };
  //   } catch (error) {
  //     const errMsg = error as { message: string };
  //     return {
  //       error: `${errMsg.message}. Create New Sale in the navigation menu. `,
  //     };
  //   }
  // };

  const invalidateOrder = async (msg: string | null = null) => {
    try {
      console.log(`Invalidating order: ${msg}`);
      if (!orderId) throw Error(`No ${orderId} found`);
      if (!relayClient) throw Error(`Disconnected from relayClient`);
      // await relayClient.updateOrder({
      //   orderId: hexToBytes(orderId),
      //   orderCancelled: { timestamp: Date.now() },
      // });

      await getOrderId();
    } catch (error) {}
  };

  const getOrderId = async () => {
    //FIXME fetch saved OrderId here
    let order_id;
    if (orderId) {
      order_id = orderId;
    } else {
      // If orderId does not exist, create new id
      const { id } = await stateManager!.orders.create();
      setOrderId(id);
      order_id = id;
    }
    return order_id;
  };

  const value = {
    orderItems,
    orderId,
    erc20Addr,
    relays,
    getOrderId,
    invalidateOrder,
    setErc20Addr,
    setOrderId,
    selectedCurrency,
    setSelectedCurrency,
    stateManager,
  };

  return (
    // @ts-expect-error FIXME
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
