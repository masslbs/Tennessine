import "../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import Listings from "./Listings.tsx";
import { createRouterWrapper } from "../utils/test.tsx";

Deno.test("Check that we can render the listings screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const wrapper = createRouterWrapper(null);
  const { unmount } = await render(<Listings />, { wrapper });
  screen.debug();
  screen.getByTestId("listings-page");
  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
