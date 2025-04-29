import { LevelStore } from "./level.ts";
import { MemStore } from "./mem.ts";

import Test from "./test.ts";
await Promise.all([MemStore, LevelStore].map(Test));
