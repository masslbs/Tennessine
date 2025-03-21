import { JollyToadStore } from "./jollytoad.ts";
import { LevelStore } from "./level.ts";
import { MemStore } from "./mem.ts";

import Test from "./test.ts";
await Promise.all([JollyToadStore, LevelStore, MemStore].map(Test));
