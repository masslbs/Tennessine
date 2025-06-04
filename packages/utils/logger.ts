// import this file to enable basic logging to the console
import {
  configure,
  defaultTextFormatter,
  getConsoleSink,
} from "@logtape/logtape";

export async function enableLogging() {
  await configure({
    sinks: {
      console: getConsoleSink({ formatter: defaultTextFormatter }),
    },
    loggers: [
      {
        category: "mass-market",
        sinks: ["console"],
      },
      // silence logtape's default warnings about meta logging
      { category: ["logtape", "meta"], lowestLevel: "warning", sinks: [] },
    ],
  });
}
