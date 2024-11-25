import { useLocalStorage } from "@uidotdev/usehooks";

export default function useKeycard() {
  return useLocalStorage<`0x${string}` | null>("keyCard", null);
}
