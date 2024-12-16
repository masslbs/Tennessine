import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { random32BytesHex } from "@massmarket/utils";
import { useKeycard } from "./useKeycard.ts";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";

Deno.test("useKeycard", async (t) => {
  GlobalRegistrator.register({});
  const randomKC = random32BytesHex();
  t.step("should set and get keycards", () => {
    const { rerender, result, unmount } = renderHook(() =>
      useKeycard(randomKC)
    );
    const [keycard, setKeycard] = result.current;
    assertEquals(randomKC, keycard);
    const randomKC2 = random32BytesHex();
    setKeycard(randomKC2);
    rerender();
    const [keycard2] = result.current;
    assertEquals(randomKC2, keycard2);
    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});
