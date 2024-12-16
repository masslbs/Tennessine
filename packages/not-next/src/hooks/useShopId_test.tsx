import React from "react";
import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert";
import { renderHook } from "@testing-library/react-hooks";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { useShopId } from "./useShopId.ts";
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

describe.skip("useShopId", () => {
  it("should return null when no shopId in search params", () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useShopId(), { wrapper });
    assertEquals(result.current.shopId, null);
  });

  it("should take shopId from search params", () => {
    const wrapper = createWrapper("123");
    const { result } = renderHook(() => useShopId(), { wrapper });
    assertEquals(result.current.shopId, BigInt(123));
  });
});
