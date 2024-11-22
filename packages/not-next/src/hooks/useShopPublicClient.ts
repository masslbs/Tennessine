import { useEffect, useState } from "react";
import { createPublicClientForChain } from "../utils/chain.ts";
// import { type ClientContext } from "@/context/types";

export default function useShopPublicClient() {
  const [shopPublicClient, setShopPublicClient] = useState(null);

  useEffect(() => {
    const pc = createPublicClientForChain();
    setShopPublicClient(pc);
  }, []);

  return shopPublicClient;
}
