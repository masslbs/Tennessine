import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSendTransaction, useWriteContract } from "wagmi";

import { logger, zeroAddress } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

import { ConnectWalletButton } from "@/app/common/components/ConnectWalletButton";
import Button from "@/app/common/components/Button";
import { ShopCurrencies } from "@/types";

const namespace = "frontend:SendTransaction";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function SendTransaction({
  purchaseAddress,
  cryptoTotal,
  chosenCurrency,
}: {
  purchaseAddress: `0x${string}` | null;
  cryptoTotal: bigint | null;
  chosenCurrency: ShopCurrencies;
}) {
  const { sendTransaction } = useSendTransaction();
  const { status } = useAccount();
  const { writeContract } = useWriteContract();

  function send() {
    try {
      debug(`Sending ${cryptoTotal} to: ${purchaseAddress}`);
      debug(
        `Chosen currency chain ID: ${chosenCurrency.chainId}, address: ${chosenCurrency.address} `,
      );
      if (chosenCurrency.address !== zeroAddress) {
        debug("ERC20 payment");
        writeContract({
          chainId: chosenCurrency.chainId,
          abi: abi.ERC20,
          address: chosenCurrency.address,
          functionName: "transfer",
          args: [purchaseAddress as `0x${string}`, cryptoTotal],
        });
      } else {
        debug("ETH payment");
        sendTransaction({
          chainId: chosenCurrency.chainId,
          to: purchaseAddress as `0x${string}`,
          value: cryptoTotal!,
        });
      }
    } catch (error) {
      errlog("Error sending payment", error);
    }
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
