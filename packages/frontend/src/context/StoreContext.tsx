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
  OrderState,
} from "@/types";
import { useMyContext } from "./MyContext";
import { StoreContent } from "@/context/types";
import { LoadingStateManager } from "@/context/initialLoadingState";
import { StateManager } from "@massmarket/stateManager";
import { BlockchainClient } from "@massmarket/blockchain";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";

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

  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });

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

  useEffect(() => {
    const publicClient = createPublicClient({
      chain: hardhat,
      transport: http(),
    });
    const blockChainClient = new BlockchainClient();
    const uri = blockChainClient.getTokenURI(publicClient).then();
    //FIXME: need to get metadata from uri.
  }, []);

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

  const getOrderId = async () => {
    const openOrders = await stateManager?.orders.getStatus(
      OrderState.STATE_OPEN,
    );
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
    shopDetails,
  };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
