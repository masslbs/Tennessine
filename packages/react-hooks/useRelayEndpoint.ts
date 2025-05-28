import { getLogger } from "@logtape/logtape";
import { discoverRelay } from "@massmarket/client";
import { useQuery } from "@tanstack/react-query";
import { useMassMarketContext } from "./useMassMarketContext.ts";

const logger = getLogger(["mass-market", "frontend", "useRelayEndpoint"]);

/*
 * This hook is used to get the relay endpoint from the context or discover it.
 */
export function useRelayEndpoint() {
  const context = useMassMarketContext();
  const q = useQuery(
    {
      queryKey: ["relayEndpoint"],
      queryFn: async () => {
        if (
          context && context.config.relayEndpoint && context.config.relayTokenId
        ) {
          const re = {
            url: new URL(context.config.relayEndpoint),
            tokenId: context.config.relayTokenId as `0x${string}`,
          };
          logger.debug(
            `using environment variables for relay endpoint ${re.url}`,
          );
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
      },
    },
  );

  return { relayEndpoint: q.data, ...q };
}
