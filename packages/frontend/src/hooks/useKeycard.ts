import { assert } from "@std/assert";
import { useLocalStorage } from "@uidotdev/usehooks";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { useWalletClient } from "wagmi";

import { RelayClient } from "@massmarket/client";
import { getWindowLocation } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { KeycardRole } from "../types.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";

type Keycard = {
  privateKey: `0x${string}`;
  role: KeycardRole;
  address: `0x${string}`;
} | null;

const logger = getLogger(["mass-market", "frontend", "useKeycard"]);

export function useKeycard() {
  const { shopId } = useShopId();
  const keyCardID = "keycard" + shopId;
  const [keycard, setKeycard] = useLocalStorage<Keycard>(keyCardID, null);
  const { data: wallet } = useWalletClient();
  const { relayEndpoint } = useRelayEndpoint();

  async function addKeycard(role: KeycardRole) {
    // 1. Generate KC
    // 2. Enroll KC
    // 3. Save to localStorage

    if (!shopId) {
      assert(shopId, "shopId is required");
      return;
    }
    if (!relayEndpoint) {
      assert(relayEndpoint, "relayEndpoint is required");
      return;
    }
    if (!wallet) {
      assert(wallet, "wallet is required");
      return;
    }
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    // This relay instance is just to enroll the keycard.
    const relayClient = new RelayClient({
      relayEndpoint,
      walletClient: wallet,
      keycard: account,
      shopId,
    });

    const res = await relayClient.enrollKeycard(
      wallet,
      account,
      true,
      getWindowLocation(),
    );
    if (!res.ok) {
      throw new Error(`Failed to enroll keycard: ${res}`);
    }

    setKeycard({
      privateKey,
      role,
      address: account!.address,
    });

    logger.debug("Success: Enrolled new guest keycard");
  }

  return {
    keycard,
    addKeycard,
  };
}
