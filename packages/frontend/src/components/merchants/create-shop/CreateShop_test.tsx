import "../../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import CreateShop from "./CreateShop.tsx";
import { createRouterWrapper } from "../../../utils/test.tsx";

Deno.test("Check that we can render the create shop screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const wrapper = createRouterWrapper(null, "/create-shop");
  const { unmount } = await render(<CreateShop />, { wrapper });
  screen.debug();
  screen.getByTestId("create-shop-page");
  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
