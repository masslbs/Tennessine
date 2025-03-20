import "../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";
import { userEvent } from "@testing-library/user-event";
import { discoverRelay, IRelayEndpoint } from "@massmarket/client";
import { random256BigInt, random32BytesHex } from "@massmarket/utils";
import { createClient, publicActions, walletActions, webSocket } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import RelayClientTestPage from "./RelayClientTestPage.tsx";

// Create a mock wallet client and account
const shopId = random256BigInt();
const client = createClient({
  chain: hardhat,
  transport: webSocket("ws://localhost:8545"),
}).extend(walletActions).extend(publicActions);
const [account] = await client.requestAddresses();

const pk = generatePrivateKey();
const kc = privateKeyToAccount(pk);

Deno.test("RelayClientTester component connects to relay", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const relayEndpoint = await discoverRelay("ws://localhost:4444/v4");
  const user = userEvent.setup();

  await t.step("renders and connects to relay", async () => {
    const { unmount } = render(
      <RelayClientTestPage
        relayEndpoint={relayEndpoint}
        walletClient={client}
        keycard={kc}
        shopId={shopId}
      />,
    );

    // Check initial rendering
    screen.getByTestId("relay-client-tester");

    // Wait for connection to be established
    await waitFor(() => {
      const status = screen.getByTestId("connection-status");
      expect(status.textContent).toContain("connected");
    }, { timeout: 1000 });

    // Test disconnect functionality
    await act(async () => {
      const disconnectButton = screen.getByTestId("disconnect-button");
      await user.click(disconnectButton);
    });

    // Verify disconnection
    await waitFor(() => {
      const status = screen.getByTestId("connection-status");
      expect(status.textContent).toContain("disconnected");
    });

    unmount();
    cleanup();
  });

  await t.step("handles connection errors", async () => {
    const relayEndpoint: IRelayEndpoint = {
      url: new URL("ws://localhost:57192/v99999"),
      tokenId:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    };
    const { unmount } = render(
      <RelayClientTestPage
        relayEndpoint={relayEndpoint}
        walletClient={client}
        keycard={kc}
        shopId={shopId}
      />,
    );

    // Check that error is displayed
    await waitFor(() => {
      const error = screen.getByTestId("connection-error");
      expect(error.textContent).toContain(
        "NetworkError: failed to connect to WebSocket",
      );
    });

    unmount();
    cleanup();
  });
});
