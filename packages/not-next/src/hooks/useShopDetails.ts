// import { useContext, useEffect } from "react";
// import * as abi from "@massmarket/contracts";
// import { MassMarketContext } from "../MassMarketContext.tsx";
// import usePublicClientByChainId from "./usePublicClientByChainId";
// import useShopId from "./useShopId.ts";

// export default function useShopDetails() {
//   const { shopDetails, setShopDetails } = useContext(MassMarketContext);
//   const shopPublicClient = usePublicClientByChainId();
//   const { shopId } = useShopId();

//   useEffect(() => {
//     (async () => {
//       const uri = await shopPublicClient.readContract({
//         address: abi.addresses.ShopReg,
//         abi: abi.shopRegAbi,
//         functionName: "tokenURI",
//         args: [shopId],
//       });
//       const url = uri as string;
//       if (url.length) {
//         const res = await fetch(url);
//         const data = await res.json();
//         setShopDetails({
//           name: data.name,
//           profilePictureUrl: data.image,
//         });
//       }
//     })();
//   }, []);

//   return { shopDetails, setShopDetails };
// }
