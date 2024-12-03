import { useEffect, useState } from "react";
import { logger } from "@massmarket/utils";
import { discoverRelay, type RelayEndpoint } from "@massmarket/client";
import process from "node:process";

const namespace = "frontend:useRelayEnpoint";
const debug = logger(namespace);

export function useRelayEndpoint() {
  const [relayEndpoint, setRelayEndpoint] = useState<RelayEndpoint | null>(
    null,
  );
  function getRelayEndpoint() {
    if (process && process.env["NEXT_PUBLIC_RELAY_TOKEN_ID"]) {
      const re = {
        url: new URL(process.env["NEXT_PUBLIC_RELAY_ENDPOINT"] as string),
        tokenId: process.env["NEXT_PUBLIC_RELAY_TOKEN_ID"] as `0x${string}`,
      };
      setRelayEndpoint(re);
      debug(`using environment variables for relay endpoint ${re.url}`);
    } else {
      discoverRelay("ws://localhost:4444/v3").then((discovered) => {
        if (!discovered.url) throw new Error("Relay endpoint URL not set");
        if (!discovered.tokenId) {
          throw new Error("Relay endpoint tokenId not set");
        }
        setRelayEndpoint(discovered);
        debug(`using testing relay endpoint ${discovered.url}`);
      });
    }
  }
  useEffect(() => {
    getRelayEndpoint();
  }, []);

  return { relayEndpoint };
}
