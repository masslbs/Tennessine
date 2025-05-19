import "../happyDomSetup.ts";
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
import { useKeycard } from "./useKeycard.ts";
import { KeycardRole } from "../types.ts";

Deno.test("useKeycard", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const shopId = random256BigInt();

  const { wrapper } = await createRouterWrapper({ shopId, createShop: true });

  let pk = "";

  await t.step("should enroll guest keycard", async () => {
    const { result } = renderHook(() => useKeycard(), { wrapper });
    await waitFor(() => {
      expect(result.current.data?.role).toEqual("guest");
      pk = result.current.data?.privateKey as string;
    });
  });

  await t.step("should return cached keycard", async () => {
    const { result } = renderHook(() => useKeycard(), { wrapper });
    await waitFor(() => {
      expect(result.current.data?.role).toEqual("guest");
      expect(result.current.data?.privateKey).toEqual(pk);
    });
  });

  await t.step("should swap guest keycard to a merchant keycard", async () => {
    const { result } = renderHook(() => useKeycard("merchant"), { wrapper });
    await waitFor(() => {
      expect(result.current.data?.role).toEqual("merchant");
      expect(result.current.data?.privateKey).not.toEqual(pk);
    });
  });
  await t.step(
    "private keys should be the same when useKeycard is called concurrently.",
    async () => {
      const { unmount } = render(<TestComponent role="guest" />, { wrapper });
      await waitFor(() => {
        const component1Pk = screen.getByTestId("component1-pk");
        const component2Pk = screen.getByTestId("component2-pk");
        expect(component1Pk.textContent).toEqual(component2Pk.textContent);
      });
      unmount();
    },
  );
  await t.step(
    "if useKeycard is called concurrently with different roles, merchant keycard should be returned",
    async () => {
      const { unmount } = render(<TestComponent role="merchant" />, {
        wrapper,
      });
      await waitFor(() => {
        const component1Pk = screen.getByTestId("component1-pk");
        const component2Pk = screen.getByTestId("component2-pk");
        expect(component1Pk.textContent).toEqual(component2Pk.textContent);
      });
      unmount();
    },
  );
  cleanup();
});

const TestComponent = ({ role }: { role: KeycardRole }) => {
  return (
    <div>
      <ChildComponent />
      <ChildComponent2 role={role} />
    </div>
  );
};
const ChildComponent = () => {
  const { data } = useKeycard();
  return <div data-testid="component1-pk">{data?.privateKey}</div>;
};
const ChildComponent2 = ({ role }: { role: KeycardRole }) => {
  const { data } = useKeycard(role);
  return <div data-testid="component2-pk">{data?.privateKey}</div>;
};
