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

function relativeTime(diff: number) {
  // Convert milliseconds to seconds
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
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
  const [lastPingReceived, setLastPingReceived] = useState<string>("Never");
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<RelayClient | null>(null);

  useEffect(() => {
    const newClient = new RelayClient({
      relayEndpoint,
      walletClient,
      keycard,
      shopId,
    });

    setClient(newClient);
    setConnectionStatus("connecting");

    // Connect to relay
    newClient.connect((error: Event) => {
      console.error("connect error", error);
      setError((error as ErrorEvent).message);
      setConnectionStatus("failed");
    }).then(() => {
      setConnectionStatus("connected");
    });

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
        setLastPingReceived("Never");
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (client && client.stats.pingsReceived > 0) {
        console.log({ stats: client.stats });
        const now = new Date();
        const diff = now.getTime() - client?.stats.lastPingReceived.getTime();
        setLastPingReceived(relativeTime(diff));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [client]);

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
      <div data-testid="stats-last-ping-received">
        Last ping received: {lastPingReceived}
      </div>
    </div>
  );
};

export default RelayClientTestPage;
