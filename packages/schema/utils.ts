export class BaseClass {
  returnAsMap(): Map<string, unknown> {
    const map = new Map();
    for (const [key, value] of Object.entries(this)) {
      if (
        ["string", "number", "boolean", "bigint"].includes(typeof value) ||
        value instanceof Uint8Array
      ) {
        map.set(key, value);
      } else if (value instanceof Date) {
        map.set(key, value);
      } else if (Array.isArray(value)) {
        const newArray = [];
        for (const item of value) {
          if (
            item instanceof BaseClass ||
            (item && typeof item.returnAsMap === "function")
          ) {
            newArray.push(item.returnAsMap());
          } else {
            newArray.push(item);
          }
        }
        map.set(key, newArray);
      } else if (value instanceof Map) {
        const newMap = new Map();
        for (const [k, v] of value.entries()) {
          if (
            v instanceof BaseClass || (v && typeof v.returnAsMap === "function")
          ) {
            newMap.set(k, v.returnAsMap());
          } else {
            newMap.set(k, v);
          }
        }
        map.set(key, newMap);
      } else if (
        value instanceof BaseClass ||
        (value && typeof value.returnAsMap === "function")
      ) {
        map.set(key, value.returnAsMap());
      } else if (value === undefined) {
        // ignore
      } else {
        console.error({ value });
        throw new Error(
          `Unknown value on ${key}. Type: ${typeof value}`,
        );
      }
    }
    return map;
  }
}
