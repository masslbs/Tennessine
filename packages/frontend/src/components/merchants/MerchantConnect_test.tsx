import "../../happyDomSetup.ts";

import { cleanup, render, screen } from "npm:@testing-library/react";
import MerchantConnect from "./MerchantConnect.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";

Deno.test("Check that we can render the merchant connect screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const wrapper = createRouterWrapper(null, "/merchant-connect");

  await t.step("Render and unmount component", async () => {
    const { unmount } = render(<MerchantConnect />, { wrapper });
    screen.getByTestId("merchant-connect-page");

    unmount();
    cleanup();
    await new Promise((resolve) => setTimeout(resolve, 200));
  });
});
