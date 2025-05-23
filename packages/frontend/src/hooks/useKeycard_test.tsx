import "../happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { random256BigInt } from "@massmarket/utils";

import { KeycardRole } from "../types.ts";
import { useKeycard } from "./useKeycard.ts";
import { createRouterWrapper } from "../testutils/mod.tsx";

Deno.test("useKeycard", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const randomKC = generatePrivateKey();
  const account = privateKeyToAccount(randomKC);

  await t.step("should set and get keycards", async () => {
    const { wrapper } = await createRouterWrapper({});

    const { result, unmount } = renderHook(() => {
      console.log("Inside renderHook callback for useKeycard");
      return useKeycard({
        privateKey: randomKC,
        role: KeycardRole.NEW_GUEST,
        address: account.address,
      });
    }, { wrapper });

    console.log("Hook result:", { result });
    console.log("result.current:", result.current);

    // Use waitFor to handle the React 19 first-render issue
    await waitFor(() => {
      if (result.current === null) {
        throw new Error("Hook still returning null");
      }

      const [keycard] = result.current;
      assertEquals(keycard.privateKey, randomKC);
      assertEquals(keycard.role, KeycardRole.NEW_GUEST);
      assertEquals(keycard.address, account.address);
    });

    unmount();
  });

  await t.step("should create random keycard if none is provided", async () => {
    const { wrapper } = await createRouterWrapper({});

    const { result, unmount } = renderHook(() => {
      console.log("Inside renderHook callback for random keycard");
      return useKeycard();
    }, { wrapper });

    console.log("Random keycard result:", result);

    await waitFor(() => {
      if (result.current === null) {
        throw new Error("Hook still returning null for random keycard");
      }

      const [keycard] = result.current;
      assertEquals(typeof keycard.privateKey, "string");
      assertEquals(keycard.privateKey.startsWith("0x"), true);
      assertEquals(keycard.role, KeycardRole.NEW_GUEST);
      assertEquals(typeof keycard.address, "string");
      assertEquals(keycard.address.startsWith("0x"), true);
    });

    unmount();
  });

  await t.step("should use keycard saved in local storage", async () => {
    const shopId = random256BigInt();
    const { wrapper } = await createRouterWrapper({ shopId });

    const testPrivateKey = generatePrivateKey();
    const testAccount = privateKeyToAccount(testPrivateKey);

    // Set up localStorage with test data
    localStorage.setItem(
      `keycard${shopId}`,
      JSON.stringify({
        privateKey: testPrivateKey,
        role: KeycardRole.MERCHANT,
        address: testAccount.address,
      }),
    );

    const { result, unmount } = renderHook(() => {
      console.log("Inside renderHook callback for localStorage test");
      return useKeycard();
    }, { wrapper });

    console.log("LocalStorage test result:", result);

    await waitFor(() => {
      if (result.current === null) {
        throw new Error("Hook still returning null for localStorage test");
      }

      const [keycard] = result.current;
      expect(keycard.privateKey).toBe(testPrivateKey);
      expect(keycard.role).toBe(KeycardRole.MERCHANT);
      expect(keycard.address).toBe(testAccount.address);
    });

    // Clean up
    localStorage.removeItem(`keycard${shopId}`);
    unmount();
  });

  cleanup();
});
