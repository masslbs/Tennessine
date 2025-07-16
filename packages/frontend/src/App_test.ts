import "./happyDomSetup.ts";
import { cleanup, render, screen } from "@testing-library/react";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { discoverRelay, RelayClient } from "@massmarket/client";
import { random256BigInt } from "@massmarket/utils";
import { testClient } from "./testutils/_createWrapper.tsx";

Deno.test("check that we can render the app", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  // we need to import App.tsx here since wagmi and rainbowkit setup timers
  const { default: App } = await import("./App.tsx");

  const config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http("https://mainnet.example.com"),
      [sepolia.id]: http("https://sepolia.example.com"),
    },
  });

  const { unmount } = render(App({ wagmiConfig: config }));

  // Just check that the element is rendered. This will throw if element is not found
  screen.getByTestId("homepage");

  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 100));
});

Deno.test("check that we can connect to the relay client", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  // Create a mock wallet client and account
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey as `0x${string}`);

  await t.step("can create and connect to relay client", async () => {
    // Create relay client
    const shopId = random256BigInt();
    const relayEndpoint = await discoverRelay();

    const client = new RelayClient({
      relayEndpoint,
      walletClient: testClient,
      keycard: account,
      shopId,
    });

    // Test connection
    const connectPromise = client.connect();

    // Verify connection was attempted
    await connectPromise;

    // Test disconnection
    await client.disconnect();
  });
});
