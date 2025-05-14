import { assert } from "@std/assert";
import { useLocalStorage } from "@uidotdev/usehooks";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { useShopId } from "./useShopId.ts";
import { KeycardRole } from "../types.ts";

type Keycard = {
  privateKey: `0x${string}`;
  role: KeycardRole;
  address: `0x${string}`;
} | null;

export function useKeycard() {
  const { shopId } = useShopId();
  const keyCardID = "keycard" + shopId;
  const [keycard, setKeycard] = useLocalStorage<Keycard>(keyCardID, null);

  function addKeycard(role: KeycardRole) {
    if (!shopId) {
      assert(false, "shopId is required");
    }
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const kc = {
      privateKey,
      role,
      address: account.address,
    };
    setKeycard(kc);
  }
  return {
    keycard,
    addKeycard,
  };
}
