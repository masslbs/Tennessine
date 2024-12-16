import { useLocalStorage } from "@uidotdev/usehooks";
import { random32BytesHex } from "@massmarket/utils";

export function useKeycard(keyCard: `0x${string}` = random32BytesHex()) {
  return useLocalStorage("keyCard", keyCard);
}
