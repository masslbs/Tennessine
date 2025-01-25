import "../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";
import { getPublicClient, getWalletClient } from "npm:@wagmi/core";
import MerchantConnect from "./MerchantConnect.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";
import { connect } from "npm:@wagmi/core";
import { hardhat } from "@wagmi/core/chains";
import { mock } from "@wagmi/connectors";
// import { hardhat } from "viem/chains";
import { createConfig, http } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
// import { anvilPrivateKey } from "@massmarket/utils";
import { createClient, createWalletClient, http as viemHttp } from "viem";
import { beforeEach } from "https://deno.land/std/testing/bdd.ts";

Deno.test("Check that we can render the merchant connect page", async () => {
  try {
    const config = createConfig({
      chains: [hardhat],
      transports: {
        [hardhat.id]: http(),
      },
      connectors: [
        mock({
          accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
          chainId: hardhat.id,
          uid: "mock",
        }),
      ],
    });

    const wrapper = createRouterWrapper(null, "/merchant-connect", config);
    const { unmount } = render(<MerchantConnect />, { wrapper });
    await config.connectors[0].connect();
    screen.getByTestId("merchant-connect-page");
    unmount();
    cleanup();
  } finally {
    // Wait for any wagmi timers/tasks to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
});
