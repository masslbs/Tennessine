import "../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import ListingDetail from "./ListingDetail.tsx";
import { createRouterWrapper } from "../utils/test.tsx";

Deno.test("Check that we can render the listing details screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const wrapper = createRouterWrapper(null);
  const { unmount } = await render(<ListingDetail />, { wrapper });
  screen.debug();
  screen.getByTestId("listing-detail-page");
  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
