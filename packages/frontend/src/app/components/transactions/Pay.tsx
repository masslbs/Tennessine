import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { logger, zeroAddress } from "@massmarket/utils";
import { BlockchainClient } from "@massmarket/blockchain";

import { useUserContext } from "@/context/UserContext";
import { ConnectWalletButton } from "@/app/common/components/ConnectWalletButton";
import Button from "@/app/common/components/Button";
import { ShopCurrencies } from "@/types";

const namespace = "frontend:Pay";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function Pay({ paymentArgs }: { paymentArgs: any }) {
  const { status } = useAccount();
  const { shopId, clientWallet } = useUserContext();

  async function sendPayment() {
    try {
      const blockchainClient = new BlockchainClient(shopId);
      let isERC20Payment = false;
      if (paymentArgs[3] !== zeroAddress) {
        debug("Approve ERC20 contract call", paymentArgs);
        await blockchainClient.preApproveERC20(
          clientWallet,
          paymentArgs[3], //chosen currency address
          paymentArgs[4], //total in crypto
        );
        isERC20Payment = true;
      }
      debug(`isERC20Payment: ${isERC20Payment}`);
      //ETH payments do not need to be approved.
      await blockchainClient.transferTokens(
        clientWallet,
        paymentArgs,
        isERC20Payment,
      );
    } catch (error) {
      errlog("Error sending payment", error);
    }
  }

  return (
    <div>
      {status === "connected" ? (
        <div className="flex flex-col gap-4">
          <ConnectButton chainStatus="name" />
          <Button
            onClick={sendPayment}
            disabled={!paymentArgs || !clientWallet}
          >
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
