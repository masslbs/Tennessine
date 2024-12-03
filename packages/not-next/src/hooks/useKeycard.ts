import { useLocalStorage } from "@uidotdev/usehooks";

export function useKeycard() {
  return useLocalStorage<`0x${string}` | null>("keyCard", null);
}
