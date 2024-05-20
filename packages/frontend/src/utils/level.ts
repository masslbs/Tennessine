import { Level } from "level";
import { ProductsMap, TagsMap, CartsMap } from "@/context/types";

const setMapData = (
  key: string,
  value: CartsMap | TagsMap | ProductsMap,
  db: Level<string, string> | null,
) => {
  if (!db) return;
  if (db.status !== "open" && db.status !== "opening") {
    db.open((e) => {
      if (e) console.log("error while opening db", { e }, "status", db.status);
    });
  }
  const mapArray = Array.from([...value.entries()]);
  db.put(key, JSON.stringify(mapArray), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Data for ${key} saved.`);
    }
  });
};

const setItem = (
  key: string,
  value: string,
  db: Level<string, string> | null,
) => {
  if (!db) return;
  if (db.status !== "open" && db.status !== "opening") {
    db.open((e) => {
      if (e) console.log("error while opening db", { e }, "status", db.status);
    });
  }
  db.put(key, JSON.stringify(value), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Data for ${key} saved.`);
    }
  });
};

const getParsedMapData = async (
  key: "products" | "tags" | "cartItems",
  db: Level<string, string>,
) => {
  if (db.status !== "open" && db.status !== "opening") {
    db.open((e) => {
      if (e) console.log("error while opening db", { e }, "status", db.status);
    });
  }
  const data = await db.get(key);
  if (data) {
    return new Map(JSON.parse(data));
  }

  return null;
};

const getItem = async (key: string, db: Level<string, string>) => {
  if (db.status !== "open" && db.status !== "opening") {
    db.open((e) => {
      if (e) console.log("error while opening db", { e }, "status", db.status);
    });
  }
  const data = await db.get(key);
  if (data) return JSON.parse(data);

  return null;
};

export { setMapData, getParsedMapData, setItem, getItem };
