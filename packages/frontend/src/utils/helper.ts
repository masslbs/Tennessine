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

export function isTest() {
  return import.meta.env?.["MODE"] !== "development" &&
    import.meta.env?.["MODE"] !== "production";
}
