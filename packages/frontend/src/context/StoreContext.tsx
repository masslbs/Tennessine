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
import { Order, OrderEventTypes, OrderId, OrderState, Status } from "@/types";
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
  const [currentOrder, setCurrentOrderId] = useState<
    {
      orderId: OrderId;
      status: OrderState;
    } | null
  >(null);

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
        setCurrentOrderId({ orderId: order.id, status: OrderState.STATE_OPEN });
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
        case OrderEventTypes.COMMIT_ITEMS:
          onCommit(order);
          break;
      }
    }

    function onCommit(order: Order) {
      if (order.status === OrderState.STATE_COMMITED) {
        setCurrentOrderId({
          orderId: order.id,
          status: OrderState.STATE_COMMITED,
        });
      }
    }
    function txHashDetected(order: Order) {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        setCurrentOrderId(null);
      }
    }

    function orderCancel(order: Order) {
      if (order.status === OrderState.STATE_CANCELED) {
        setCurrentOrderId(null);
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

  async function getCurrentOrder() {
    // Return existing order if available
    if (currentOrder) {
      return currentOrder;
    }

    // Check if state manager is ready
    if (!clientWithStateManager) {
      warn("stateManager not ready");
      return null;
    }

    const orderManager = clientWithStateManager.stateManager.orders;

    // First try to find an open order
    const openOrders = await orderManager.getStatus(OrderState.STATE_OPEN);

    if (openOrders.length === 1) {
      setCurrentOrderId({
        orderId: openOrders[0],
        status: OrderState.STATE_OPEN,
      });
      return openOrders[0];
    } else if (openOrders.length > 1) {
      errlog("Multiple open orders found");
      return null;
    } else {
      // If no open order, look for committed order
      debug("No open order found, looking for committed order");
      const committedOrders = await orderManager.getStatus(
        OrderState.STATE_COMMITED,
      );

      if (committedOrders.length === 1) {
        setCurrentOrderId({
          orderId: committedOrders[0],
          status: OrderState.STATE_COMMITED,
        });
        return committedOrders[0];
      } else if (committedOrders.length > 1) {
        errlog("Multiple committed orders found");
        return null;
      } else {
        debug("No order yet");
        return null;
      }
    }
  }

  const value = {
    shopDetails,
    setShopDetails,
    getBaseTokenInfo,
    currentOrder,
    getCurrentOrder,
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
