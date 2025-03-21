import React, { useEffect, useState } from "react";
import { IRelayEndpoint, RelayClient } from "@massmarket/client";
import type { WalletClient } from "viem";
import type { Account } from "viem/accounts";

interface RelayClientTestPageProps {
  relayEndpoint: IRelayEndpoint;
  walletClient: WalletClient;
  keycard: Account;
  shopId: bigint;
}

const RelayClientTestPage: React.FC<RelayClientTestPageProps> = ({
  relayEndpoint,
  walletClient,
  keycard,
  shopId,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "failed" | "disconnected"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<RelayClient | null>(null);

  useEffect(() => {
    const setupClient = async () => {
      try {
        // Create relay client
        const newClient = new RelayClient({
          relayEndpoint,
          walletClient,
          keycard,
          shopId,
        });

        setClient(newClient);
        setConnectionStatus("connecting");

        // Connect to relay
        await newClient.connect((error: Event) => {
          console.error("connect error", error);
          setError(error.message);
          setConnectionStatus("failed");
        });
        setConnectionStatus("connected");
      } catch (err) {
        console.error("setupClient error", err);
        setError(err.toString());
        setConnectionStatus("disconnected");
      }
    };

    setupClient();

    // Cleanup function to disconnect when component unmounts
    return () => {
      if (client) {
        client.disconnect().catch((err) => {
          console.error("Error disconnecting:", err);
        });
      }
    };
  }, [relayEndpoint, walletClient, keycard, shopId]);

  const handleDisconnect = async () => {
    if (client) {
      try {
        await client.disconnect();
        setConnectionStatus("disconnected");
      } catch (err: unknown) {
        console.error("disconnect error", err);
        setError(err instanceof Error ? err.message : String(err));
        setConnectionStatus("failed");
      }
    }
  };

  return (
    <div data-testid="relay-client-tester">
      <div data-testid="connection-status">Status: {connectionStatus}</div>
      {error && <div data-testid="connection-error">Error: {error}</div>}
      {connectionStatus === "connected" && (
        <button
          type="button"
          data-testid="disconnect-button"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      )}
    </div>
  );
};

export default RelayClientTestPage;
