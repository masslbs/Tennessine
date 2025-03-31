import { useLocalStorage } from "@uidotdev/usehooks";
import { generatePrivateKey } from "viem/accounts";

import { useShopId } from "./useShopId.ts";
import { KeycardRole } from "../types.ts";

export function useKeycard(
  keycard = { privateKey: generatePrivateKey(), role: KeycardRole.NEW_GUEST },
) {
  const { shopId } = useShopId();
  if (shopId === null) {
    throw new Error("Shop ID is null");
  }
  const keyCardID = "keycard" + shopId;
  // console.log({shopId, keyCardID});
  return useLocalStorage(keyCardID, keycard);
}
