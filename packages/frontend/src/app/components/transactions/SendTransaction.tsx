import React from "react";
import debugLib from "debug";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction, useAccount } from "wagmi";

import { ConnectWalletButton } from "@/app/common/components/ConnectWalletButton";
import Button from "@/app/common/components/Button";

const log = debugLib("log:Checkout");
log.color = "242";

export default function SendTransaction({
  purchaseAddress,
  cryptoTotal,
}: {
  purchaseAddress: string | null;
  cryptoTotal: bigint | null;
}) {
  const { data: hash, sendTransaction } = useSendTransaction();
  const { status } = useAccount();

  console.log({ hash });

  function send() {
    log({ purchaseAddress, cryptoTotal });
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
