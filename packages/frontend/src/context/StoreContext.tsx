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
  BaseTokenDetails,
} from "@/types";
import { useMyContext } from "./MyContext";
import { StoreContent } from "@/context/types";
import { LoadingStateManager } from "@/context/initialLoadingState";
import { StateManager } from "@massmarket/stateManager";
import { hardhat, mainnet } from "viem/chains";
import * as abi from "@massmarket/contracts";
import { createPublicClient, http, Address } from "viem";
import { getTokenInformation, getChainById } from "@/app/utils";

// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>({});

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [selectedCurrency, setSelectedCurrency] =
    useState<ShopCurrencies | null>(null);
  const { relayClient, shopId, shopPublicClient } = useMyContext();
  const [stateManager, setStateManager] = useState<
    StateManager | LoadingStateManager
  >(new LoadingStateManager());

  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });
  const [baseTokenDetails, setBaseTokenDetails] = useState<BaseTokenDetails>({
    decimal: null,
    symbol: "",
  });

  useEffect(() => {
    if (relayClient && shopId) {
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
        const shopClient = createPublicClient({
          chain: process.env.DEV ? hardhat : mainnet,
          transport: http(),
        });
        //instantiate stateManager and set it in context
        const stateManager = new StateManager(
          relayClient,
          listingStore,
          tagStore,
          shopManifestStore,
          orderStore,
          keycardStore,
          shopId,
          shopClient,
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
    if (shopPublicClient && shopId) {
      shopPublicClient
        .readContract({
          address: abi.addresses.ShopReg as Address,
          abi: abi.ShopReg,
          functionName: "tokenURI",
          args: [BigInt(shopId)],
        })
        .then(() => {
          //FIXME: setShopDetails with data from uri
          console.log({ uri });
        });
    }

    //Get base token decimal and symbol.
    stateManager.manifest.get().then((manifest) => {
      const { chainId, address } = manifest.pricingCurrency;
      const chain = getChainById(chainId!);
      const baseTokenPublicClient = createPublicClient({
        chain,
        transport: http(),
      });
      getTokenInformation(baseTokenPublicClient, address!).then((res) => {
        setBaseTokenDetails(res);
      });
    });
  }, []);

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
    baseTokenDetails,
  };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
