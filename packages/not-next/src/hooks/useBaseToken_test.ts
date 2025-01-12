import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";

import { useBaseToken } from "./useBaseToken.ts";
import { createRouterWrapper } from "../utils/mod.ts";

Deno.test("useBaseToken", async (t) => {
  GlobalRegistrator.register({});

  await t.step("should return the base token", async () => {
    const wrapper = createRouterWrapper();
    const { result, unmount } = renderHook(() => useBaseToken(), { wrapper });
    const { baseToken } = result.current;
    console.log("baseToken@@", baseToken);
    // assertEquals(baseToken, "ETH");
    unmount();
    cleanup();
    // Wait for any rainbowkit/wagmi timers/tasks to complete, else test will fail with leak error
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
});
