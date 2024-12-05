// import { useEffect, useState } from "react";
// import { useChains } from "wagmi";

// import { logger } from "@massmarket/utils";
// import useClientWithStateManager from "../useClientWithStateManager.ts";

// interface BaseToken {
//   symbol: string;
//   decimals: number;
// }
// const namespace = "frontend:useBaseToken";
// const debug = logger(namespace);

// export default function useBaseToken() {
//   const [baseToken, setBaseToken] = useState<BaseToken | null>(null);
//   const { clientStateManager } = useClientWithStateManager();
//   const chains = useChains();

//   useEffect(() => {
//     (async () => {
//       const manifest = await clientStateManager.stateManager.manifest.get();
//       const { chainId, address } = manifest.pricingCurrency;
//       const chain = chains.find((chain) => chainId === chain.id);
//       if (!chain) {
//         throw new Error("No chain found");
//       }

//       const baseTokenPublicClient = createPublicClientForChain(chain);
//       //Get base token decimal and symbol.
//       const res = await getTokenInformation(baseTokenPublicClient, address!);
//       debug(`getBaseTokenInfo: name: ${res[0]} | decimals:${res[1]}`);
//       setBaseToken({
//         symbol: res[0],
//         decimals: res[1],
//       });
//     })();
//   }, []);

//   return { baseToken };
// }
