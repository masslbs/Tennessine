import { formatUnits } from "viem";

export async function asyncIteratorToMap<K, V>(
  iterator: () => AsyncIterable<[K, V]>,
): Promise<Map<K, V>> {
  const items = new Map();
  for await (
    const [
      id,
      item,
    ] of iterator()
  ) {
    items.set(id, item);
  }
  return items;
}

export function multiplyAndFormatUnits(
  price: string,
  quantity: number,
  decimals: number,
) {
  return formatUnits(BigInt(price) * BigInt(quantity), decimals);
}

export function removeCachedKeycards() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes("keycard")) {
      const keycard = JSON.parse(localStorage.getItem(key)!);
      if(keycard.role === "guest-new"){
        localStorage.removeItem(key);
        i--; 
      }
    }
  }
}