import { formatUnits } from "viem";
import { env } from "./env.ts";

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

export function isTest() {
  return env?.["MODE"] !== "development" &&
    env?.["MODE"] !== "production";
}
