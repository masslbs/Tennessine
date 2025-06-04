import { BrowserLevel } from "browser-level";
import { LevelStore } from "./level.ts";

export const BrowserLevelStore = (dbName: string) =>
  new LevelStore(
    new BrowserLevel(dbName, {
      valueEncoding: "view",
      keyEncoding: "view",
    }),
  );
