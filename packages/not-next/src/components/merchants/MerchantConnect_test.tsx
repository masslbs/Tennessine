import "../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import MerchantConnect from "./MerchantConnect.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";

Deno.test("Check that we can render the merchant connect page", async (t) => {
  await t.step("should render the merchant connect page", async () => {
    const wrapper = createRouterWrapper(null, "/merchant-connect");
    const { unmount } = await render(<MerchantConnect />, { wrapper });
    screen.debug();
    screen.getByTestId("merchant-connect-page");
    unmount();
  });
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
