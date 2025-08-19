import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getLogger } from "@logtape/logtape";

import ButtonLink from "../common/ButtonLink.tsx";

const logger = getLogger(["mass-market", "frontend", "ConnectMerchant"]);

export default function ConnectMerchant() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!address) {
      logger.info`Invalidating keycard query`;
      queryClient.invalidateQueries({ queryKey: ["keycard"] });
    }
  }, [address]);

  return (
    <main
      className="p-5 md:flex justify-center"
      data-testid="connect-merchant"
    >
      <section className="md:w-[560px] w-full">
        <h1 className="py-[10px]">Connect your wallet</h1>
        <section className="mt-2 flex flex-col gap-1 bg-white p-5 rounded-lg">
          <p>
            Access your existing shops or create a new shop to start selling
            goods today! Access your existing shops or create a new shop to
            start selling goods today!
          </p>
          <p>
            Remember: all your data is owned by you - no-one can cut-off your
            access and you can always choose to port it to your own client,
            relay or other custom app.
          </p>
          <div>
            <div className="flex flex-col gap-4 mt-5">
              <ConnectButton chainStatus="name" />
              <div className="flex">
                <ButtonLink to="/my-shops" disabled={!address}>
                  My Shops
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
