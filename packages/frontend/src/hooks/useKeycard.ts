import { useLocalStorage } from "@uidotdev/usehooks";
import { generatePrivateKey } from "viem/accounts";

import { useShopId } from "./useShopId.ts";

export function useKeycard(
  keycard = { privateKey: generatePrivateKey(), role: "guest-new" },
) {
  const { shopId } = useShopId();
  return useLocalStorage("keycard" + shopId, keycard);
}
