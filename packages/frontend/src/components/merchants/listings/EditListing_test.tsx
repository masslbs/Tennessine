import "../../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import EditListing from "./EditListing.tsx";
import { createRouterWrapper } from "../../../utils/test.tsx";

Deno.test("Check that we can render the edit listing screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const wrapper = createRouterWrapper(null);
  const { unmount } = await render(<EditListing />, { wrapper });
  screen.debug();
  screen.getByTestId("edit-listing-page");
  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
