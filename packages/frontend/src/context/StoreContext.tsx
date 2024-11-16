// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useEffect, useState } from "react";
import { useChains } from "wagmi";
import { usePathname } from "next/navigation";

import * as abi from "@massmarket/contracts";
import { assert, logger } from "@massmarket/utils";

import { StoreContent } from "@/context/types";
import { useUserContext } from "@/context/UserContext";
import {
  createPublicClientForChain,
  getTokenInformation,
  isMerchantPath,
} from "@/app/utils";
import { ListingId, Order, OrderEventTypes, OrderState, Status } from "@/types";
import { useClient } from "@/context/AuthContext";

const namespace = "frontend:StoreContext";
const debug = logger(namespace);
const warn = logger(namespace, "warn");
const errlog = logger(namespace, "error");

export const StoreContext = createContext<StoreContent>({});

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const chains = useChains();
  const { clientWithStateManager, shopPublicClient, shopId } = useUserContext();
  const pathname = usePathname();
  const { clientConnected } = useClient();

  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });
  const [committedOrderId, setCommittedOrderId] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    // If there is a committed order outside of the checkout flow, cancel committed order.
    if (pathname !== "/checkout/" && committedOrderId) {
      cancelAndCreateOrder().then();
    }
  }, [pathname, clientWithStateManager?.stateManager]);

  useEffect(() => {
    if (committedOrderId) {
      globalThis.addEventListener("beforeunload", cancelAndCreateOrder);
    }
    return () => {
      globalThis.removeEventListener("beforeunload", cancelAndCreateOrder);
    };
  }, []);

  useEffect(() => {
    // clientConnected check is to make sure during store creation, we are not trying to get tokenURI before we even set it.
    if (shopPublicClient && shopId && clientConnected === Status.Complete) {
      (async () => {
        const uri = await shopPublicClient.readContract({
          address: abi.addresses.ShopReg,
          abi: abi.shopRegAbi,
          functionName: "tokenURI",
          args: [BigInt(shopId)],
        });
        const url = uri as string;
        if (url.length) {
          const res = await fetch(url);
          const data = await res.json();
          setShopDetails({
            name: data.name,
            profilePictureUrl: data.image,
          });
        }
      })();
    }
  }, [shopPublicClient && shopId && clientConnected === Status.Complete]);

  useEffect(() => {
    function onOrderCreate(order: Order) {
      if (order.status === OrderState.STATE_OPEN) {
        setOpenOrderId(order.id);
      }
    }
    function onOrderUpdate(res: [OrderEventTypes, Order]) {
      const order = res[1];
      const type = res[0];

      switch (type) {
        case OrderEventTypes.CANCELLED:
          orderCancel(order);
          break;
        case OrderEventTypes.PAYMENT_TX:
          txHashDetected(order);
          break;
      }
    }
    function txHashDetected(order: Order) {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        setOpenOrderId(null);
      }
    }

    function orderCancel(order: Order) {
      if (order.status === OrderState.STATE_CANCELED) {
        setOpenOrderId(null);
      }
    }

    if (clientWithStateManager?.stateManager) {
      clientWithStateManager.stateManager.orders.on("create", onOrderCreate);
      clientWithStateManager.stateManager.orders.on("update", onOrderUpdate);

      return () => {
        clientWithStateManager.stateManager.orders.removeListener(
          "create",
          onOrderCreate,
        );
        clientWithStateManager.stateManager.orders.removeListener(
          "update",
          onOrderUpdate,
        );
      };
    }
  }, [clientWithStateManager]);

  async function cancelAndCreateOrder() {
    const sm = clientWithStateManager.stateManager;
    debug(`Cancelling order ID: ${committedOrderId}`);
    const [_type, cancelledOrder] = await sm.orders.cancel(committedOrderId);
    // Once order is cancelled, create a new order and add the same items.
    const newOrder = await sm.orders.create();
    debug("New order created");
    const listingsToAdd = Object.entries(cancelledOrder.items).map(
      ([listingId, quantity]) => {
        return {
          listingId: listingId as ListingId,
          quantity,
        };
      },
    );
    await sm.orders.addItems(newOrder.id, listingsToAdd);
    debug("Listings added to new order");
  }

  async function getBaseTokenInfo() {
    assert(clientWithStateManager, "clientWithStateManager not ready");
    //Get base token decimal and symbol.
    const manifest = await clientWithStateManager.stateManager.manifest.get();
    const { chainId, address } = manifest.pricingCurrency;
    const chain = chains.find((chain) => chainId === chain.id);
    if (!chain) {
      throw new Error("No chain found");
    }
    const baseTokenPublicClient = createPublicClientForChain(chain);
    const res = await getTokenInformation(baseTokenPublicClient, address!);
    debug(`getBaseTokenInfo: name: ${res[0]} | decimals:${res[1]}`);
    return res;
  }

  async function getOpenOrderId() {
    if (openOrderId) {
      return openOrderId;
    }
    if (!clientWithStateManager) {
      warn("stateManager not ready");
      return null;
    }
    try {
      // TODO: this still has the problem of faulting/blocking over a previous stuck order
      const res = await clientWithStateManager.stateManager.orders.getStatus(
        OrderState.STATE_OPEN,
      );
      if (res.length > 1) {
        debug("Multiple open orders found");
      } else if (!res.length) {
        debug("No open order found");
      } else {
        setOpenOrderId(res[0]);
        return res[0];
      }
    } catch (error) {
      if (error.notFound) {
        debug("No open orders yet");
        return null;
      }
      errlog("Error getting open order", error);
    }
  }

  const value = {
    shopDetails,
    setShopDetails,
    getBaseTokenInfo,
    setCommittedOrderId,
    committedOrderId,
    openOrderId,
    getOpenOrderId,
  };
  // clientConnected is set to Complete only after ClientWithStateManager is instantiated and store db is created.
  // since all the children components need stateManager, don't return the children until we have stateManager is loaded in UserContext.
  if (clientConnected !== Status.Complete && !isMerchantPath(pathname)) {
    return <main></main>;
  }

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
