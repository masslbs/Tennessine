import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction, useAccount } from "wagmi";

import { logger } from "@massmarket/utils";

import { ConnectWalletButton } from "@/app/common/components/ConnectWalletButton";
import Button from "@/app/common/components/Button";

const namespace = "frontend:SendTransaction";
const debug = logger(namespace);

export default function SendTransaction({
  purchaseAddress,
  cryptoTotal,
}: {
  purchaseAddress: string | null;
  cryptoTotal: bigint | null;
}) {
  const { sendTransaction } = useSendTransaction();
  const { status } = useAccount();

  function send() {
    debug(`Sending ${cryptoTotal} to: ${purchaseAddress}`);
    sendTransaction({
      to: purchaseAddress as `0x${string}`,
      value: cryptoTotal!,
    });
  }

  return (
    <div>
      {status === "connected" ? (
        <div className="flex flex-col gap-4">
          <ConnectButton chainStatus="name" />
          <Button onClick={send} disabled={!purchaseAddress || !cryptoTotal}>
            <h6>Pay</h6>
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <ConnectWalletButton />
        </div>
      )}
    </div>
  );
}
