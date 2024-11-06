// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useState, useEffect } from "react";
import { useChains } from "wagmi";
import { Address } from "viem";
import { usePathname } from "next/navigation";

import * as abi from "@massmarket/contracts";
import { StoreContent } from "@/context/types";
import { useUserContext } from "@/context/UserContext";
import { getTokenInformation, createPublicClientForChain } from "@/app/utils";
import { getTokenInformation } from "@/app/utils";
import { ListingId, Order } from "@/types";


// @ts-expect-error FIXME
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

  useEffect(() => {
    // If there is a committed order outside of the checkout flow, cancel committed order.
    if (pathname !== "/checkout/" && committedOrderId) {
      const sm = clientWithStateManager.stateManager;
      log("Exited out of checkout flow after committing order.");
      sm.orders.cancel(committedOrderId).then((cancelledOrder: Order) => {
        log("Cancelled committed order");
        // Once order is cancelled, create a new order and add the same items.
        sm.orders.create().then((newOrder: Order) => {
          log("New order created");
          const listingsToAdd = Object.entries(cancelledOrder.items).map(
            ([listingId, quantity]) => {
              return {
                listingId: listingId as ListingId,
                quantity,
              };
            },
          );
          sm.orders.addItems(newOrder.id, listingsToAdd);
          log("Listings added to new order.");
        });
      });
    }
  }, [pathname, clientWithStateManager?.stateManager]);

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

  async function getBaseTokenInfo() {
    //Get base token decimal and symbol.
    const manifest =
      await clientWithStateManager!.stateManager!.manifest.get();
    const { chainId, address } = manifest.pricingCurrency;
    const chain = chains.find((chain) => chainId === chain.id);
    if (!chain) {
      throw new Error("No chain found");
    }
    const baseTokenPublicClient = createPublicClientForChain(chain);
    const res = await getTokenInformation(baseTokenPublicClient, address!);
    return res;
  }

  const value = {
    shopDetails,
    setShopDetails,
    getBaseTokenInfo,
    setCommittedOrderId,
    committedOrderId,
  };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
