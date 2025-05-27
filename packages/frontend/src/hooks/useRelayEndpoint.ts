import { getLogger } from "@logtape/logtape";
import { discoverRelay, IRelayEndpoint } from "@massmarket/client";
import { useQuery } from "@tanstack/react-query";
import { useMassMarketContext } from "../MassMarketContext.ts";

const logger = getLogger(["mass-market", "frontend", "useRelayEndpoint"]);

export function useRelayEndpoint() {
  const { config: env } = useMassMarketContext();
  const q = useQuery(
    {
      queryKey: ["relayEndpoint"],
      queryFn: async () => {
        if (env.relayTokenId && env.relayEndpoint) {
          const re: IRelayEndpoint = {
            url: new URL(env.relayEndpoint),
            tokenId: env.relayTokenId as `0x${string}`,
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
