// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useState, useEffect } from "react";
import debugLib from "debug";
import { useChains } from "wagmi";
import { createPublicClient, http, Address } from "viem";

import * as abi from "@massmarket/contracts";
import { StoreContent } from "@/context/types";
import { useUserContext } from "@/context/UserContext";
import { getTokenInformation } from "@/app/utils";

// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>({});

const debug = debugLib("frontend:StoreContext");
const log = debugLib("log:StoreContext");
log.color = "242";

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const chains = useChains();
  const { clientWithStateManager, shopPublicClient, shopId } = useUserContext();

  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });

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

  const value = {
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
