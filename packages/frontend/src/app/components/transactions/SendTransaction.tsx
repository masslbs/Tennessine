import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSendTransaction, useWriteContract } from "wagmi";

import { logger } from "@massmarket/utils";
import { erc20Abi } from "@massmarket/contracts";

import { ConnectWalletButton } from "@/app/common/components/ConnectWalletButton";
import Button from "@/app/common/components/Button";

const namespace = "frontend:SendTransaction";
const debug = logger(namespace);

export default function SendTransaction({
  chainId,
  purchaseAddress,
  cryptoTotal,
  erc20ContractAddress,
}: {
  chainId: number;
  purchaseAddress: string | null;
  cryptoTotal: bigint | null;
  erc20ContractAddress?: `0x${string}`;
}) {
  const { sendTransaction } = useSendTransaction();
  const { status } = useAccount();
  const { writeContract } = useWriteContract();

  function send() {
    debug(`Sending ${cryptoTotal} to: ${purchaseAddress}`);
    if (erc20ContractAddress) {
      writeContract({
        chainId,
        abi: erc20Abi,
        address: erc20ContractAddress,
        functionName: "tansfer",
        args: [
          purchaseAddress as `0x${string}`,
          cryptoTotal,
        ],
      });
    } else {
      sendTransaction({
        chainId,
        to: purchaseAddress as `0x${string}`,
        value: cryptoTotal!,
      });
    }
  }

  return (
    <div>
      {status === "connected"
        ? (
          <div className="flex flex-col gap-4">
            <ConnectButton chainStatus="name" />
            <Button onClick={send} disabled={!purchaseAddress || !cryptoTotal}>
              <h6>Pay</h6>
            </Button>
          </div>
        )
        : (
          <div className="flex justify-center">
            <ConnectWalletButton />
          </div>
        )}
    </div>
  );
}
