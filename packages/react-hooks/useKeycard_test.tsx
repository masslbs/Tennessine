import { cleanup, render, renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { random256BigInt } from "@massmarket/utils";

import { register, unregister } from "./happyDomSetup.ts";
import { type KeycardRole, useKeycard } from "./useKeycard.ts";
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
  "Should enroll guest keycard",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("enroll merchant card", async () => {
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

    await t.step("enroll guest card", async () => {
      const { result, unmount } = renderHook(
        () => useKeycard({ role: "guest" }),
        {
          wrapper: createWrapper(shopId),
        },
      );
      await waitFor(() => {
        expect(result.current.data?.role).toEqual("guest");
      });
      unmount();
    });
  }),
);

Deno.test(
  "Hook should return error if keycard enrollment fails",
  denoTestOptions,
  testWrapper(async (shopId) => {
    const wrapper = createWrapper(shopId);
    // Enroll should fail since we didn't create a shop.
    const { result } = renderHook(() => useKeycard(), { wrapper });
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.error).toBeInstanceOf(Error);
    });
  }),
);

Deno.test(
  "Private keys should be the same when useKeycard is called concurrently.",
  denoTestOptions,
  testWrapper((shopId) => {
    const wrapper = createWrapper(shopId);
    const rendered = render(<TestComponent role="merchant" />, { wrapper });
    const component1Pk = rendered.getByTestId("component1-pk");
    const component2Pk = rendered.getByTestId("component2-pk");
    expect(component1Pk.textContent).toEqual(component2Pk.textContent);
  }),
);

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
  return (
    <div>
      <p data-testid="component1-pk">{data?.privateKey}</p>
      <p data-testid="component1-role">{data?.role}</p>
    </div>
  );
};
const ChildComponent2 = ({ role }: { role: KeycardRole }) => {
  const { data } = useKeycard({ role });
  return (
    <div>
      <p data-testid="component2-pk">{data?.privateKey}</p>
      <p data-testid="component2-role">{data?.role}</p>
    </div>
  );
};
