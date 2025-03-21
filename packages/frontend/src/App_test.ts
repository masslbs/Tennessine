import "./happyDomSetup.ts";
import { cleanup, render, screen } from "@testing-library/react";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

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
  // Import necessary modules
  const { RelayClient, discoverRelay } = await import("@massmarket/client");
  const { createWalletClient, custom } = await import("viem");
  const { privateKeyToAccount } = await import("viem/accounts");
  const { random32BytesHex, random256BigInt } = await import(
    "@massmarket/utils"
  );

  // Create a mock wallet client and account
  const privateKey = random32BytesHex();
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    transport: custom({
      request: async ({ method, params }) => {
        if (method === "personal_sign") {
          // Mock signing functionality
          return "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
        }
        throw new Error(`Unhandled method: ${method}`);
      },
    }),
  });

  await t.step("can create and connect to relay client", async () => {
    // Create relay client
    const shopId = random256BigInt();
    const relayEndpoint = await discoverRelay("ws://localhost:8080/v4");

    const client = new RelayClient({
      relayEndpoint,
      walletClient,
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
