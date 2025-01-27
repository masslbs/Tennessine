import "../../happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";
import { hardhat } from "wagmi/chains";
import { mock } from "@wagmi/connectors";
import { 
  createConfig, 
  http,
  connect,
  createTransport
} from '@wagmi/core'
import MerchantConnect from "./MerchantConnect.tsx";
import { createRouterWrapper } from "../../utils/test.tsx";
import { custom } from "wagmi";



Deno.test("Check that we can render the merchant connect page", async () => {
  
  
  try {
    const mockConnector = mock({
      accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
      chainId: hardhat.id,
    });

    const config = createConfig({
      autoConnect: false,
      chains: [hardhat],
      transports: {
        [hardhat.id]: http(),
      },
      connectors: [mockConnector],
      features: { 
        defaultConnected: true
      }, 
    });

    const result = await connect(config, { connector: mockConnector })
console.log({result})
    const wrapper = createRouterWrapper(null, "/merchant-connect", config);
    const { unmount } = render(<MerchantConnect />, { wrapper });
    screen.getByTestId("merchant-connect-page");
    unmount();
    cleanup();
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
});
