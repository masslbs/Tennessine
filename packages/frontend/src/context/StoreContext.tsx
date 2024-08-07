// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Item,
  Order,
  KeyCard,
  ShopManifest,
  Tag,
  ShopCurrencies,
  OrderId,
  Status,
} from "@/types";
import { useMyContext } from "./MyContext";
import { StoreContent } from "@/context/types";
import { LoadingStateManager } from "@/context/initialLoadingState";
import { StateManager } from "@massmarket/stateManager";

// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>({});

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [selectedCurrency, setSelectedCurrency] =
    useState<ShopCurrencies | null>(null);
  const { relayClient, shopId } = useMyContext();
  const [stateManager, setStateManager] = useState<
    StateManager | LoadingStateManager
  >(new LoadingStateManager());

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

  // const verify = async (
  //   _orderItems: Map<OrderId, OrderState>,
  //   _pubKeys: `0x${string}`[],
  // ) => {
  //   console.log(_orderItems, _pubKeys);
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
  // };

  const getOrderId = async () => {
    //FIXME: This part is still wip. We will have to go through the openOrders(array) and verify the signed address via keycard store. There should only be one open order per clerk.
    // For now just set current order id as the first open order
    const openOrders = await stateManager?.orders.getStatus(Status.Pending);
    let order_id: OrderId;
    if (openOrders && openOrders.length) {
      order_id = openOrders[0] as OrderId;
      setOrderId(order_id);
    } else {
      // If open order id does not exist, create new id
      const { id } = await stateManager!.orders.create();
      setOrderId(id);
      order_id = id;
    }
    return order_id;
  };

  const value = {
    orderId,
    getOrderId,
    setOrderId,
    selectedCurrency,
    setSelectedCurrency,
    stateManager,
  };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
