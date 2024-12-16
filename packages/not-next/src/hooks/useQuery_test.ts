import { assertEquals } from "jsr:@std/assert";
import { cleanup } from "npm:@testing-library/react";
import { renderHook } from "npm:@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { useQuery } from "./useQuery.ts";

Deno.test("test useQuery instantiation", async (t) => {
  GlobalRegistrator.register({});
  const value = Symbol("hello");
  function testQuery(shouldThrow: boolean) {
    return () => {
      if (shouldThrow) {
        throw new Error("Error!");
      }
      return Promise.resolve(value);
    };
  }
  const { rerender, result, unmount } = renderHook(() => {
    return useQuery(testQuery(false), []);
  });
  await t.step("initial definitions", () => {
    const { isConnected, error, result: queryResult } = result.current;
    assertEquals(isConnected, false, "is connected should be false");
    assertEquals(queryResult, undefined, "result should be undefined");
    assertEquals(error, false, "error should be false");
  });
  rerender();
  await t.step("resolved values", () => {
    const { isConnected, error, result: queryResult } = result.current;
    assertEquals(isConnected, true, "should be connected");
    assertEquals(queryResult, value, "result should be set");
    assertEquals(error, false, "error should be false");
  });
  await t.step(
    "cached results should  be used if the hook is used again",
    async (t) => {
      const { rerender, result, unmount } = renderHook(() => {
        // this should not throw, since the results should be cached
        return useQuery(testQuery(true), []);
      });

      await t.step("initial definitions", () => {
        const { isConnected, error, result: queryResult } = result.current;
        assertEquals(isConnected, false, "is connected should be false");
        assertEquals(queryResult, undefined, "result should be undefined");
        assertEquals(error, false, "error should be false");
      });
      rerender();
      await t.step("resolved values", () => {
        const { isConnected, error, result: queryResult } = result.current;
        assertEquals(isConnected, true, "should be connected");
        assertEquals(queryResult, value, "result should be set");
        assertEquals(error, false, "error should be false");
      });
      unmount();
    },
  );
  unmount();
  cleanup();
  await GlobalRegistrator.unregister();
});
