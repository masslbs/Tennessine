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
