import { cleanup, render, renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { random256BigInt } from "@massmarket/utils";
import { RelayClient } from "@massmarket/client";

import { register, unregister } from "./happyDomSetup.ts";
import { useRelayClient } from "./useRelayClient.ts";
import { useKeycard } from "./useKeycard.ts";
import { createShop, createWrapper } from "./_createWrapper.tsx";

const denoTestOptions = {
  sanitizeResources: false,
  sanitizeOps: false,
};

function testWrapper(
  cb: (id: bigint, t: Deno.TestContext) => Promise<void> | void,
) {
  return async (_t: Deno.TestContext) => {
    register();
    const shopId = random256BigInt();
    await createShop(shopId);
    await cb(shopId, _t);
    cleanup();
    await unregister();
  };
}

Deno.test(
  "Hook returns RelayClient without errors.",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    //Enrolling merchant keycard since relay expects first keycard enrollment for a shop to be merchant.
    await t.step("Enroll merchant keycard.", async () => {
      const { result, unmount } = renderHook(
        () => useKeycard({ role: "merchant" }),
        {
          wrapper: createWrapper(shopId),
        },
      );
      await waitFor(() => {
        expect(result.current.data?.role).toEqual("merchant");
      });
      unmount();
    });

    await t.step("RelayClient is returned.", async () => {
      const { result, unmount } = renderHook(() => useRelayClient(), {
        wrapper: createWrapper(shopId),
      });
      await waitFor(() => {
        expect(result.current.data).toBeInstanceOf(RelayClient);
        expect(result.current.data?.shopId).toEqual(shopId);
      });

      unmount();
    });

    await t.step("Calling hook concurrently does not error.", async () => {
      const wrapper = createWrapper(shopId);
      const rendered = render(<TestComponent />, { wrapper });
      await waitFor(() => {
        const component1Pk = rendered.getByTestId("component1-readyState");
        const component2Pk = rendered.getByTestId("component2-readyState");
        expect(component1Pk.textContent).toEqual("1");
        expect(component1Pk.textContent).toEqual(component2Pk.textContent);
      });
    });
  }),
);

function TestComponent() {
  return (
    <div>
      <ChildComponent />
      <ChildComponent2 />
    </div>
  );
}
function ChildComponent() {
  const { data } = useRelayClient();
  return (
    <div>
      <p data-testid="component1-readyState">{data?.connection?.readyState}</p>
    </div>
  );
}
function ChildComponent2() {
  const { data } = useRelayClient();
  return (
    <div>
      <p data-testid="component2-readyState">{data?.connection?.readyState}</p>
    </div>
  );
}
