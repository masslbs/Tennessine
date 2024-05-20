import { Level } from "level";
import { ProductsMap, TagsMap, CartsMap } from "@/context/types";

const setMapData = async (
  key: string,
  value: CartsMap | TagsMap | ProductsMap,
  db: Level<string, string>,
) => {
  const mapArray = Array.from([...value.entries()]);
  await db.put(key, JSON.stringify(mapArray));
  console.log(`Data for ${key} saved.`);
};

const setItem = async (
  key: string,
  value: string,
  db: Level<string, string>,
) => {
  await db.put(key, JSON.stringify(value));
  console.log(`Data for ${key} saved.`);
};

const getParsedMapData = async (
  key: "products" | "tags" | "cartItems",
  db: Level<string, string>,
) => {
  const map = await db.get(key);
  if (map) {
    return new Map(JSON.parse(map));
  } else return null;
};

const getItem = async (key: string, db: Level<string, string>) => {
  console.log("error handler");
  const data = await db.get(key);
  if (data) return JSON.parse(data);
  return null;
};

export { setMapData, getParsedMapData, setItem, getItem };
