import React, { useEffect, useState } from "react";
import { createPublicClientForChain } from "../utils/chain";
import { type ClientContext } from "@/context/types";

export default function useShopPublicClient() {
  const [shopPublicClient, setShopPublicClient] = useState<
    ClientContext | null
  >(null);

  useEffect(() => {
    const pc = createPublicClientForChain();
    setShopPublicClient(pc);
  }, []);

  return shopPublicClient;
}
