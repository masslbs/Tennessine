import "../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import ShopSettings from "./ShopSettings.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";

Deno.test("Check that we can render the shop settings screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const wrapper = createRouterWrapper(null);
  const { unmount } = await render(<ShopSettings />, { wrapper });
  screen.debug();
  screen.getByTestId("shop-settings-page");
  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
