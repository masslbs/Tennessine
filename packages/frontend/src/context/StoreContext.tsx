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
} from "@/types";
import { useMyContext } from "./MyContext";
import { StoreContent, OrderId } from "@/context/types";
import { StateManager } from "@massmarket/statemanager";

// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>({});

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [selectedCurrency, setSelectedCurrency] =
    useState<ShopCurrencies | null>(null);
  const { relayClient, shopId } = useMyContext();
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
