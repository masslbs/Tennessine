import "../../happyDomSetup.ts";
import { render, screen } from "@testing-library/react";
import { createRouterWrapper } from "../../utils/test.tsx";
import CheckoutFlow from "./CheckoutFlow.tsx";

Deno.test("Check that we can render the checkout screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const { wrapper } = await createRouterWrapper();
  const { unmount } = render(<CheckoutFlow />, { wrapper });
  screen.debug();
  screen.getByTestId("checkout-screen");

  screen.getByTestId("cart");
  unmount();
});
