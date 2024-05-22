import { BrowserLevel } from "browser-level";
import { ProductsMap, TagsMap, CartsMap } from "@/context/types";

const setMapData = (
  key: string,
  value: CartsMap | TagsMap | ProductsMap,
  db: BrowserLevel<string, string> | null,
) => {
  if (!db) return;
  const mapArray = Array.from([...value.entries()]);
  return db.put(key, JSON.stringify(mapArray));
};

const setItem = (
  key: string,
  value: string,
  db: BrowserLevel<string, string> | null,
) => {
  if (!db) return;
  return db.put(key, JSON.stringify(value));
};

const getParsedMapData = async (
  key: "products" | "tags" | "cartItems",
  db: BrowserLevel<string, string>,
) => {
  const data = await db.get(key);
  if (data) {
    return new Map(JSON.parse(data));
  }
  return null;
};

const getItem = async (key: string, db: BrowserLevel<string, string>) => {
  const data = await db.get(key);
  if (data) return JSON.parse(data);
  return null;
};

export { setMapData, getParsedMapData, setItem, getItem };
