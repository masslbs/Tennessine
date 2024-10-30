// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useState } from "react";
import debugLib from "debug";
import { useChains } from "wagmi";
import { createPublicClient, http } from "viem";

import { OrderId, OrderState } from "@/types";
import { StoreContent } from "@/context/types";
import { useUserContext } from "@/context/UserContext";
import { getTokenInformation } from "@/app/utils";

// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>({});

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const { clientWithStateManager } = useUserContext();
  const debug = debugLib("frontend:StoreContext");
  const log = debugLib("log:StoreContext");
  log.color = "242";

  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });
  const chains = useChains();

  // useEffect(() => {
  //       shopPublicClient
  //         .readContract({
  //           address: abi.addresses.ShopReg as Address,
  //           abi: abi.ShopReg,
  //           functionName: "tokenURI",
  //           args: [BigInt(shopId)],
  //         })
  //         .then((uri) => {
  //           const url = uri as string;
  //           if (url.length) {
  //             fetch(url).then((res) => {
  //               res.json().then((data) => {
  //                 setShopDetails({
  //                   name: data.name,
  //                   profilePictureUrl: data.image,
  //                 });
  //               });
  //             });
  //           }
  //         });

  //       //close db connection on unload
  //       if (window && db) {
  //         window.addEventListener("beforeunload", () => {
  //           console.log("closing db connection");
  //           db.close();
  //         });
  //       }
  //     })();
  //   }
  // }, [relayClient]);

  async function getBaseTokenInfo() {
    //Get base token decimal and symbol.
    try {
      const manifest =
        await clientWithStateManager!.stateManager!.manifest.get();
      const { chainId, address } = manifest.pricingCurrency;
      const chain = chains.find((chain) => chainId === chain.id);
      const baseTokenPublicClient = createPublicClient({
        chain,
        transport: http(),
      });
      const res = await getTokenInformation(baseTokenPublicClient, address!);
      return res;
    } catch (error) {
      debug("Error: getBaseTokenInfo", error);
      throw new Error("Error: getBaseTokenInfo");
    }
  }

  const getOrderId = async () => {
    try {
      const openOrders =
        await clientWithStateManager!.stateManager!.orders.getStatus(
          OrderState.STATE_OPEN,
        );
      if (openOrders.length > 1) {
        debug("Multiple open orders found");
      }
      if (openOrders && openOrders.length) {
        return openOrders[0] as OrderId;
      }
    } catch (error) {
      log("No open orders found");
      return null;
    }
  };

  const value = {
    shopDetails,
    getOrderId,
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
