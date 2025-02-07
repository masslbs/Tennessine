import { useLocalStorage } from "@uidotdev/usehooks";
import { random32BytesHex } from "@massmarket/utils";
import { useShopId } from "./useShopId.ts";

export function useKeycard(
  keycard = { privateKey: random32BytesHex(), role: "guest-new" },
) {
  const { shopId } = useShopId();
  return useLocalStorage("keycard" + shopId, keycard);
}
