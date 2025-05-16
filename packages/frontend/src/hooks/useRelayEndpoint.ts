import { getLogger } from "@logtape/logtape";
import { discoverRelay } from "@massmarket/client";
import { env } from "../utils/env.ts";
import { useQuery } from "../hooks/useQuery.ts";

const logger = getLogger(["mass-market", "frontend", "useRelayEndpoint"]);

export function useRelayEndpoint() {
  const { result } = useQuery(async () => {
    if (env.relayTokenId && env.relayEndpoint) {
      const re = {
        url: new URL(env.relayEndpoint),
        tokenId: env.relayTokenId,
      };
      logger.debug(`using environment variables for relay endpoint ${re.url}`);
      return re;
    } else {
      const discovered = await discoverRelay("ws://localhost:4444/v4");
      if (!discovered.url) throw new Error("Relay endpoint URL not set");
      if (!discovered.tokenId) {
        throw new Error("Relay endpoint tokenId not set");
      }
      logger.debug(`using testing relay endpoint ${discovered.url}`);
      return discovered;
    }
  });

  return { relayEndpoint: result };
}
