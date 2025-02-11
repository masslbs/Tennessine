import "../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import OrderDetails from "./OrderDetails.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";

Deno.test("Check that we can render the order details screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const wrapper = createRouterWrapper(null);
  const { unmount } = await render(<OrderDetails />, { wrapper });
  screen.debug();
  screen.getByTestId("order-details-page");
  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
