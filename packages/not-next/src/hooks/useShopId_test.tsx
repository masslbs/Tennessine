import React from "react";

import { assertEquals } from "jsr:@std/assert";
import { renderHook } from "@testing-library/react-hooks";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import useShopId from "./useShopId.ts";
import { routeTree } from "../routeTree.gen.ts";

const createTestRouter = (param: string | null) => {
  return createRouter({
    routeTree,
    //initializes a memory history instance with shopId param with the passed in value.
    history: createMemoryHistory({
      initialEntries: [`/?shopId=${param}`],
    }),
  });
};

const createWrapper = (param: string | null = null) => {
  const router = createTestRouter(param);

  return ({ children }: { children: React.ReactNode }) => (
    <>
      <RouterProvider router={router} />
      {children}
    </>
  );
};

Deno.test("should return null when no shopId in search params", () => {
  const wrapper = createWrapper();
  // result.current field returned by renderHook always contains the latest values returned by the hook passed in.
  const { result } = renderHook(() => useShopId(), { wrapper });
  assertEquals(result.current.shopId, null);
});

Deno.test("should take shopId from search params", () => {
  const wrapper = createWrapper("123");
  const { result } = renderHook(() => useShopId(), { wrapper });
  // Test that returned shopId is a bigint
  assertEquals(result.current.shopId, BigInt(123));
});
