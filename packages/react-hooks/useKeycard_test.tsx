import { useEffect, useState } from "react";
import { render, renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { useKeycard } from "./useKeycard.ts";
import {
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";

Deno.test(
  "Enroll guest/merchantkeycard.",
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
        expect(result.current.keycard?.role).toEqual("merchant");
      });
      unmount();
    });

    await t.step("enroll guest card", async () => {
      const { result, unmount } = renderHook(
        () => useKeycard({ role: "guest" }),
        // createWrapper is called with setupMockConnectors = false, so we don't set up a test account.
        {
          wrapper: createWrapper(shopId, 0, false),
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
    // Enroll should fail since relay expects first keycard enrollment for a shop to be merchant.
    const wrapper = createWrapper(shopId);
    const { result } = renderHook(() => useKeycard(), { wrapper });
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.error).toBeInstanceOf(Error);
    });
  }),
);

Deno.test(
  "If merchant keycard is enrolled, any subsequent hook calls should return the cached merchant keycard and the query should not be run again.",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("setQueryData", async () => {
      const wrapper = createWrapper(shopId);
      const rendered = render(<TestComponent />, { wrapper });
      await waitFor(() => {
        const role1 = rendered.getByTestId("component1-role");
        const role2 = rendered.getByTestId("component2-role");
        expect(role1.textContent).toEqual("merchant");
        expect(role2.textContent).toEqual("merchant");
        const component1Pk = rendered.getByTestId("component1-pk");
        const component2Pk = rendered.getByTestId("component2-pk");
        expect(component2Pk.textContent).toContain("0x");
        expect(component1Pk.textContent).toEqual(component2Pk.textContent);
      });
    });
  }),
);

const TestComponent = () => {
  const [enrollGuest, setEnrollGuest] = useState(false);
  const { keycard } = useKeycard({ role: "merchant" });
  // Once merchant keycard is enrolled, ChildComponent will render and call useKeycard with guest role. But both should return merchant keycard.
  useEffect(() => {
    if (keycard?.role === "merchant") {
      setEnrollGuest(true);
    }
  }, [keycard]);

  return (
    <div>
      <MerchantComponent />
      {enrollGuest && <ChildComponent />}
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
const MerchantComponent = () => {
  const { data } = useKeycard({ role: "merchant" });
  return (
    <div>
      <p data-testid="component2-pk">{data?.privateKey}</p>
      <p data-testid="component2-role">{data?.role}</p>
    </div>
  );
};
