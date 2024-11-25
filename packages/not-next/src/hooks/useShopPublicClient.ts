import { useEffect, useState } from "react";
import { createPublicClientForChain } from "../utils/chain.ts";
// import { type ClientContext } from "@/context/types";

// FIXME: Do we want to keep this in context?
// We don't need to store this in useState, since createPublicClientForChain is synchronous
// If we don't care about calling createPublicClientForChain multiple times,
//we should probably just call createPublicClientforChain directly and delete this hook.
export default function useShopPublicClient() {
  const [shopPublicClient, setShopPublicClient] = useState(null);

  useEffect(() => {
    const pc = createPublicClientForChain();
    setShopPublicClient(pc);
  }, []);

  return shopPublicClient;
}
