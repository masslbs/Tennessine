import { render, renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { RelayClient } from "@massmarket/client";

import { useRelayClient } from "./useRelayClient.ts";
import { useKeycard } from "./useKeycard.ts";
import {
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";

Deno.test(
  "Hook returns RelayClient without errors.",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    // FIXME: Enrolling merchant keycard since relay expects first keycard enrollment for a shop to be merchant.
    // We can remove this once this relay restriction is removed.

    await t.step("Enroll merchant keycard.", async () => {
      const { result, unmount } = renderHook(
        () => useKeycard(),
        {
          wrapper: createWrapper(shopId),
        },
      );
      await waitFor(() => {
        expect(result.current.keycard?.role).toEqual("merchant");
      });
      unmount();
    });

    await t.step(
      "RelayClient is returned when there is a connected wallet.",
      async () => {
        const { result, unmount } = renderHook(() => useRelayClient(), {
          wrapper: createWrapper(shopId),
        });
        await waitFor(() => {
          expect(result.current.data).toBeInstanceOf(RelayClient);
          expect(result.current.data?.shopId).toEqual(shopId);
          // Trying to serialize RelayClient class should throw error since we don't want it to be cached during refreshes.
          expect(() => JSON.stringify(result.current.data)).toThrow();
        });

        unmount();
      },
    );
    await t.step(
      "RelayClient is returned when there is no connected wallet.",
      async () => {
        const { result, unmount } = renderHook(() => useRelayClient(), {
          // Testing that relayClient and connect and authenticate with burner wallet passed as the wallet client
          wrapper: createWrapper(shopId, 0, false),
        });
        await waitFor(() => {
          expect(result.current.data).toBeInstanceOf(RelayClient);
          expect(result.current.data?.shopId).toEqual(shopId);
          // Trying to serialize RelayClient class should throw error since we don't want it to be cached during refreshes.
          expect(() => JSON.stringify(result.current.data)).toThrow();
        });

        unmount();
      },
    );

    await t.step("Calling hook concurrently does not error.", async () => {
      const rendered = render(<TestComponent />, {
        wrapper: createWrapper(shopId),
      });
      await waitFor(() => {
        const component1Pk = rendered.getByTestId("component1-readyState");
        const component2Pk = rendered.getByTestId("component2-readyState");
        expect(component1Pk.textContent).toEqual("1");
        expect(component1Pk.textContent).toEqual(component2Pk.textContent);
      });
    });
  }),
);

Deno.test(
  "If keycard is undefined, hook does not return RelayClient",
  denoTestOptions,
  testWrapper(async (shopId) => {
    const { result } = renderHook(() => useRelayClient(), {
      wrapper: createWrapper(shopId),
    });
    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
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
