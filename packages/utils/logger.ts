// import this file to enable basic logging to the console
import { configure, getConsoleSink } from "@logtape/logtape";

await configure({
  sinks: {
    console: getConsoleSink(),
  },
  loggers: [
    {
      category: "mass-market",
      sinks: ["console"],
    },
  ],
});
