import "../happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { cleanup, renderHook } from "@testing-library/react";
import { expect } from "@std/expect";

import { random256BigInt, random32BytesHex } from "@massmarket/utils";

import { KeycardRole } from "../types.ts";
import { useKeycard } from "./useKeycard.ts";
import { createRouterWrapper } from "../testutils/mod.tsx";

Deno.test("useKeycard", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const randomKC = random32BytesHex();
  await t.step("should set and get keycards", async () => {
    const { wrapper } = await createRouterWrapper();
    const { result, unmount } = renderHook(
      () => useKeycard({ privateKey: randomKC, role: KeycardRole.NEW_GUEST }),
      { wrapper },
    );
    const [keycard] = result.current;
    assertEquals(keycard.privateKey, randomKC);
    assertEquals(keycard.role, KeycardRole.NEW_GUEST);
    unmount();
  });

  await t.step("should create random keycard if none is provided", async () => {
    const { wrapper } = await createRouterWrapper();

    const { result, unmount } = renderHook(() => useKeycard(), { wrapper });
    const [keycard] = result.current;
    assertEquals(keycard.privateKey !== null, true);
    unmount();
  });
  await t.step("should use keycard saved in local storage", async () => {
    const shopId = random256BigInt();

    const { wrapper } = await createRouterWrapper(shopId);

    const privateKey = random32BytesHex();

    localStorage.setItem(
      `keycard${shopId}`,
      JSON.stringify({ privateKey, role: "merchant" }),
    );
    const { result, unmount } = renderHook(() => useKeycard(), { wrapper });
    const [keycard] = result.current;
    expect(keycard.privateKey).toBe(privateKey);
    expect(keycard.role).toBe("merchant");
    unmount();
  });
  cleanup();
});
