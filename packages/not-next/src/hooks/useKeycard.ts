import { useLocalStorage } from "@uidotdev/usehooks";
import { random32BytesHex } from "@massmarket/utils";
import { useShopId } from "./useShopId";

export function useKeycard(
  keyCard = { privateKey: random32BytesHex(), role: "guest" },
) {
  const { shopId } = useShopId();
  return useLocalStorage("keyCard" + shopId, keyCard);
}
