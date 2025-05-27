import { useLocalStorage } from "@uidotdev/usehooks";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { useShopId } from "@massmarket/react-hooks";
import { KeycardRole } from "../types.ts";

export function useKeycard(
  keycard?: {
    privateKey: `0x${string}`;
    role: KeycardRole;
    address: `0x${string}`;
  },
) {
  if (!keycard) {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    keycard = {
      privateKey,
      role: KeycardRole.NEW_GUEST,
      address: account.address,
    };
  }
  const { shopId } = useShopId();
  const keyCardID = "keycard" + shopId;
  return useLocalStorage(keyCardID, keycard);
}
