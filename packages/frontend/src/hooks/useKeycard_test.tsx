import { assertEquals } from "jsr:@std/assert";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { cleanup, renderHook } from "@testing-library/react-hooks";

import { random32BytesHex } from "@massmarket/utils";
import { useKeycard } from "./useKeycard.js";
import { createRouterWrapper } from "../utils/mod.js";

Deno.test("useKeycard", async (t) => {
  GlobalRegistrator.register({});
  const randomKC = random32BytesHex();
  await t.step("should set and get keycards", () => {
    const wrapper = createRouterWrapper();
    const { result, unmount } = renderHook(
      () => useKeycard({ privateKey: randomKC, role: "guest" }),
      { wrapper },
    );
    const [keycard] = result.current;
    assertEquals(keycard.privateKey, randomKC);
    unmount();
  });

  await t.step("should create random keycard if none is provided", () => {
    const wrapper = createRouterWrapper();
    const { result, unmount } = renderHook(() => useKeycard(), { wrapper });
    const [keycard] = result.current;
    assertEquals(keycard.privateKey !== null, true);
    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});
