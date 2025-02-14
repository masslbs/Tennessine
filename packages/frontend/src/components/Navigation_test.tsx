import "../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import Navigation from "./Navigation.tsx";
import { createRouterWrapper } from "../utils/test.tsx";

Deno.test("Check that we can render the navigation bar", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const { wrapper } = await createRouterWrapper(null);
  const { unmount } = await render(<Navigation />, { wrapper });
  screen.debug();
  screen.getByTestId("navigation");
  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
