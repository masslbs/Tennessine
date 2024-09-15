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
import { Address } from "@ethereumjs/util";
import { hexToBytes } from "viem";
// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>({});

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [selectedCurrency, setSelectedCurrency] =
    useState<ShopCurrencies | null>(null);
  const { relayClient, shopId, walletAddress } = useMyContext();
  const [stateManager, setStateManager] = useState<
    StateManager | LoadingStateManager
  >(new LoadingStateManager());

  useEffect(() => {
    if (relayClient) {
      (async () => {
        //FIXME: Prerender error if we import normally: https://nextjs.org/docs/messages/prerender-error
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

        const keycardStore = db.sublevel<string, KeyCard[]>("keycardStore", {
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

  const getOrderId = async () => {
    //Getting all open orders.
    const openOrders = await stateManager?.orders.getStatus(Status.Pending);
    let order_id: OrderId | null = null;
    if (openOrders && openOrders.length && walletAddress) {
      //Getting all public keys by current wallet address.
      const publicKeys = await stateManager?.keycards.get(
        walletAddress.toLowerCase() as `0x${string}`,
      );
      //Getting address from public key.
      const addresses = publicKeys.map((a: OrderId) => {
        return Address.fromPublicKey(hexToBytes(a)).toString();
      });
      for (const o of openOrders) {
        //Go through the open orders and see if the signer address is one of the public keys created with the wallet address.
        //signer property is retrieved from recoverMessageAddress fn. See the pull fn in client/stream.ts
        if (o.signer) {
          if (addresses.includes(o.signer.toLowerCase())) {
            order_id = o.orderId;
          }
        }
      }
      if (!order_id) {
        const { id } = await stateManager!.orders.create();
        order_id = id;
      }

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
