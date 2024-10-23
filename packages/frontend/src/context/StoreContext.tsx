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
import { useUserContext } from "./UserContext";
import { StoreContent } from "@/context/types";
import { LoadingStateManager } from "@/context/initialLoadingState";
import { StateManager } from "@massmarket/stateManager";
import * as abi from "@massmarket/contracts";
import { createPublicClient, http, Address } from "viem";
import { getTokenInformation } from "@/app/utils";
import debugLib from "debug";
import { useChains } from "wagmi";

// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>({});

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const debug = debugLib("frontend: StoreContext");
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [selectedCurrency, setSelectedCurrency] =
    useState<ShopCurrencies | null>(null);
  const { relayClient, shopId, shopPublicClient } = useUserContext();
  const [stateManager, setStateManager] = useState<
    StateManager | LoadingStateManager
  >(new LoadingStateManager());

  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });
  const chains = useChains();

  useEffect(() => {
    if (relayClient && shopId && shopPublicClient) {
      (async () => {
        // Prerender error if we import normally: https://nextjs.org/docs/messages/prerender-error
        const { Level } = await import("level");
        const merchantKC = localStorage.getItem("merchantKeyCard");
        const guestKC = localStorage.getItem("guestCheckoutKC");
        const dbName = `${shopId?.slice(0, 7)}${merchantKC ? merchantKC.slice(0, 5) : guestKC ? guestKC.slice(0, 5) : "-guest"}`;
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
          shopId,
          shopPublicClient,
        );
        stateManager.eventStreamProcessing.catch((e) => {
          debug(`Error while executing eventStreamProcessing ${e}`);
        });
        stateManager.seqNo.on("seqNo", (res) => {
          localStorage.setItem("seqNo", res);
        });
        setStateManager(stateManager);

        shopPublicClient
          .readContract({
            address: abi.addresses.ShopReg as Address,
            abi: abi.ShopReg,
            functionName: "tokenURI",
            args: [BigInt(shopId)],
          })
          .then((uri) => {
            const url = uri as string;
            if (url.length) {
              fetch(url).then((res) => {
                res.json().then((data) => {
                  setShopDetails({
                    name: data.name,
                    profilePictureUrl: data.image,
                  });
                });
              });
            }
          });

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

  async function getBaseTokenInfo() {
    //Get base token decimal and symbol.
    try {
      const manifest = await stateManager.manifest.get();
      const { chainId, address } = manifest.pricingCurrency;
      const chain = chains.find((chain) => chainId === chain.id);
      const baseTokenPublicClient = createPublicClient({
        chain,
        transport: http(),
      });
      const res = await getTokenInformation(baseTokenPublicClient, address!);
      return res;
    } catch (error) {
      debug("Failed: getBaseTokenInfo", error);
      throw new Error("Failed: getBaseTokenInfo");
    }
  }

  const getOrderId = async () => {
    const openOrders = await stateManager?.orders.getStatus(
      OrderState.STATE_OPEN,
    );
    if (openOrders && openOrders.length) {
      return openOrders[0] as OrderId;
    } else return null;
  };

  const value = {
    orderId,
    getOrderId,
    setOrderId,
    selectedCurrency,
    setSelectedCurrency,
    stateManager,
    shopDetails,
    setShopDetails,
    getBaseTokenInfo,
  };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
