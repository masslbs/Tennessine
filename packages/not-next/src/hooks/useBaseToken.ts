// import { useEffect, useState } from "react";
// import { useChains } from "wagmi";

// import { logger } from "@massmarket/utils";
// import { useClientWithStateManager } from "./useClientWithStateManager.ts";
// import { useShopId } from "./useShopId.ts";
// import { usePublicClient } from "./usePublicClient.ts";
// import { getTokenInformation } from "../utils/token.ts";
// interface BaseToken {
//   symbol: string;
//   decimals: number;
// }
// const namespace = "frontend:useBaseToken";
// const debug = logger(namespace);

// export function useBaseToken() {
//   const [baseToken, setBaseToken] = useState<BaseToken | null>(null);
//   const { clientStateManager } = useClientWithStateManager();
//   const chains = useChains();
//   const shopId = useShopId();

//   useEffect(() => {
//     (async () => {
//       const manifest = await clientStateManager.stateManager.manifest.get();
//       const { chainId, address } = manifest.pricingCurrency;

//       const baseTokenPublicClient = usePublicClient(chainId);
//       //Get base token decimal and symbol.
//       const res = await getTokenInformation(baseTokenPublicClient, address!);
//       debug(`getBaseTokenInfo: name: ${res[0]} | decimals:${res[1]}`);
//       setBaseToken({
//         symbol: res[0],
//         decimals: res[1],
//       });
//     })();
//   }, [shopId]);

//   return { baseToken };
// }
