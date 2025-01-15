export async function asyncIteratorToMap(
  iterator: () => AsyncIterable<[string, unknown]>,
) {
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
