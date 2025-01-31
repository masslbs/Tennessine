import "../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";
import { hardhat } from "wagmi/chains";
import { mock } from "@wagmi/connectors";
import { connect, createConfig, createTransport, http } from "@wagmi/core";
import MerchantConnect from "./MerchantConnect.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";
import { custom } from "wagmi";

// Add this before your test

Deno.test("Check that we can render the merchant connect page", async (t) => {
  const wrapper = createRouterWrapper(null, "/merchant-connect");

  await t.step("Render and unmount component", async () => {
    const { unmount } = render(<MerchantConnect />, { wrapper });
    screen.getByTestId("merchant-connect-page");

    // Proper cleanup sequence
    unmount();
    cleanup();

    // Allow any pending timers/microtasks to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
