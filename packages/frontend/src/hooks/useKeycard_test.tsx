import "../happyDomSetup.ts";
import { useEffect } from "react";
import { useWalletClient } from "wagmi";
import { assertEquals } from "@std/assert";
import {
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { expect } from "@std/expect";

import { random256BigInt } from "@massmarket/utils";

import { createRouterWrapper } from "../testutils/mod.tsx";
import { useShopId } from "../hooks/useShopId.ts";
import { useRelayEndpoint } from "../hooks/useRelayEndpoint.ts";
import { useKeycard } from "./useKeycard.ts";
import { KeycardRole } from "../types.ts";

const TestComponent = ({ role }: { role: KeycardRole }) => {
  const { keycard, addKeycard } = useKeycard();
  const { data: wallet } = useWalletClient();
  const { shopId } = useShopId();
  const { relayEndpoint } = useRelayEndpoint();

  useEffect(() => {
    if (!wallet || !shopId || !relayEndpoint) return;
    addKeycard(role).then();
  }, [wallet, shopId, relayEndpoint]);

  return <p data-testid="keycard-role">{keycard?.role}</p>;
};

Deno.test("useKeycard", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  await t.step(
    "Should return null as keycard before addKeycard is called.",
    async () => {
      const { wrapper } = await createRouterWrapper();

      const { result, unmount } = renderHook(() => useKeycard(), { wrapper });
      const { keycard } = result.current;
      assertEquals(keycard, null);
      unmount();
    },
  );

  await t.step("addKeycard enrolls and caches guest keycard.", async () => {
    const shopId = random256BigInt();

    const { wrapper } = await createRouterWrapper({ shopId, createShop: true });

    const { unmount } = render(<TestComponent role="guest" />, { wrapper });
    await waitFor(() => {
      const role = screen.getByTestId("keycard-role");
      expect(role.textContent).toEqual("guest");
    });

    unmount();
  });

  await t.step("addKeycard enrolls and caches merchant keycard.", async () => {
    const shopId = random256BigInt();

    const { wrapper } = await createRouterWrapper({ shopId, createShop: true });

    const { unmount } = render(<TestComponent role="merchant" />, { wrapper });
    await waitFor(() => {
      const role = screen.getByTestId("keycard-role");
      expect(role.textContent).toEqual("merchant");
    });

    unmount();
  });
  cleanup();
});
