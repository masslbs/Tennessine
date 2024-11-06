// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useState, useEffect } from "react";
import { useChains } from "wagmi";
import { Address } from "viem";
import { usePathname } from "next/navigation";

import * as abi from "@massmarket/contracts";
import { logger } from "@massmarket/utils";

import { StoreContent } from "@/context/types";
import { useUserContext } from "@/context/UserContext";
import { getTokenInformation, createPublicClientForChain } from "@/app/utils";
import { ListingId, Order, OrderState } from "@/types";

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
      window.addEventListener("beforeunload", cancelAndCreateOrder);
    }
    return () => {
      window.removeEventListener("beforeunload", cancelAndCreateOrder);
    };
  }, []);

  useEffect(() => {
    if (shopPublicClient && shopId) {
      (async () => {
        const uri = await shopPublicClient.readContract({
          address: abi.addresses.ShopReg as Address,
          abi: abi.ShopReg,
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
  }, [shopPublicClient, shopId]);

  useEffect(() => {
    function txHashDetected(order: Order) {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        setOpenOrderId(null);
      }
    }
    function orderCreated(order: Order) {
      if (order.status === OrderState.STATE_OPEN) {
        setOpenOrderId(order.id);
      }
    }
    function orderCancel(order: Order) {
      if (order.status === OrderState.STATE_CANCELED) {
        setOpenOrderId(null);
      }
    }

    if (clientWithStateManager?.stateManager) {
      clientWithStateManager.stateManager.orders.on(
        "addPaymentTx",
        txHashDetected,
      );
      clientWithStateManager.stateManager.orders.on("create", orderCreated);
      clientWithStateManager.stateManager.orders.on(
        "orderCanceled",
        orderCancel,
      );

      return () => {
        clientWithStateManager.stateManager.orders.removeListener(
          "addPaymentTx",
          txHashDetected,
        );
        clientWithStateManager.stateManager.orders.removeListener(
          "create",
          orderCreated,
        );
        clientWithStateManager.stateManager.orders.removeListener(
          "orderCanceled",
          orderCancel,
        );
      };
    }
  }, [clientWithStateManager]);

  async function cancelAndCreateOrder() {
    const sm = clientWithStateManager.stateManager;
    const cancelledOrder = await sm.orders.cancel(committedOrderId);
    // Once order is cancelled, create a new order and add the same items.
    const newOrder = await sm.orders.create();
    const listingsToAdd = Object.entries(cancelledOrder.items).map(
      ([listingId, quantity]) => {
        return {
          listingId: listingId as ListingId,
          quantity,
        };
      },
    );
    await sm.orders.addItems(newOrder.id, listingsToAdd);
  }

  async function getBaseTokenInfo() {
    //Get base token decimal and symbol.
    const manifest = await clientWithStateManager!.stateManager!.manifest.get();
    const { chainId, address } = manifest.pricingCurrency;
    const chain = chains.find((chain) => chainId === chain.id);
    if (!chain) {
      throw new Error("No chain found");
    }
    const baseTokenPublicClient = createPublicClientForChain(chain);
    const res = await getTokenInformation(baseTokenPublicClient, address!);
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

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
