import "../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";

import ShopSettings from "./ShopSettings.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";
import { random256BigInt } from "@massmarket/utils";
import { payees, shippingRegions } from "@massmarket/utils/test";
import { addresses } from "@massmarket/contracts";

Deno.test("Check that we can render the shop settings screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const { wrapper, csm } = await createRouterWrapper(null);
  await csm.stateManager!.manifest.create(
    {
      acceptedCurrencies: [{ chainId: 12, address: addresses.zeroAddress }],
      pricingCurrency: { chainId: 12, address: addresses.zeroAddress },
      payees: payees,
      shippingRegions,
    },
    random256BigInt(),
  );
  const { unmount } = await render(<ShopSettings />, { wrapper });
  screen.getByTestId("shop-settings-page");
  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
});
