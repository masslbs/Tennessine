import { Level } from "level";
import { ProductsMap, TagsMap, CartsMap } from "@/context/types";

const setMapData = (
  key: string,
  value: CartsMap | TagsMap | ProductsMap,
  db: Level<string, string> | null,
) => {
  if (!db) return;
  const mapArray = Array.from([...value.entries()]);
  return db.put(key, JSON.stringify(mapArray));
};

const setItem = (
  key: string,
  value: string,
  db: Level<string, string> | null,
) => {
  if (!db) return;
  return db.put(key, JSON.stringify(value));
};

const getParsedMapData = async (
  key: "products" | "tags" | "cartItems",
  db: Level<string, string>,
) => {
  try {
    const data = await db.get(key);
    if (data) {
      return new Map(JSON.parse(data));
    }
  } catch (error) {
    console.log({ error });
  }

  return null;
};

const getItem = async (key: string, db: Level<string, string>) => {
  try {
    const data = await db.get(key);
    if (data) return JSON.parse(data);
  } catch (error) {
    console.log({ error });
  }

  return null;
};

export { setMapData, getParsedMapData, setItem, getItem };
