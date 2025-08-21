import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { useIsOwner } from "./useIsOwner.ts";
import {
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";

Deno.test(
  "useIsOwner should return correct ownership status",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("should return isOwner true for shop owner", async () => {
      const { result, unmount } = renderHook(
        () => useIsOwner(),
        {
          wrapper: createWrapper(shopId, 0, true), // Connect to the owner account
        },
      );

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
        expect(result.current.isOwner).toBe(true);
      });
      unmount();
    });

    await t.step("should return isOwner false for non-owner", async () => {
      const { result, unmount } = renderHook(
        () => useIsOwner(),
        {
          wrapper: createWrapper(shopId, 1, true), // Use second test account (non-owner)
        },
      );

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
        expect(result.current.isOwner).toBe(false);
      });
      unmount();
    });

    await t.step("should return isPending true initially", async () => {
      const { result, unmount } = renderHook(
        () => useIsOwner(),
        {
          wrapper: createWrapper(shopId, 0, true),
        },
      );

      // Initially should be pending
      expect(result.current.isPending).toBe(true);

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
      unmount();
    });
  }),
);

Deno.test(
  "useIsOwner should return false for disconnected wallet state",
  denoTestOptions,
  testWrapper(async (shopId) => {
    const { result } = renderHook(
      () => useIsOwner(),
      {
        wrapper: createWrapper(shopId, 0, false), // Third parameter is false so we don't set up any mock connectors, which means no wallet will be connected.
      },
    );
    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isOwner).toBe(false);
    });
  }),
);

Deno.test(
  "useIsOwner should return false for disconnected wallet state",
  denoTestOptions,
  testWrapper(async () => {
    const randomShopId = BigInt("999999999999999999999999999999");

    const { result, unmount } = renderHook(
      () => useIsOwner(),
      {
        wrapper: createWrapper(randomShopId, 0),
      },
    );
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.isOwner).toBe(false);
    });
    unmount();
  }),
);
