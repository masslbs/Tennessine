import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { addresses } from "@massmarket/contracts";

import { assert, logger } from "@massmarket/utils";
import {
  approveERC20,
  payNative,
  payTokenPreApproved,
} from "@massmarket/blockchain";

import { useUserContext } from "@/context/UserContext";
import { ConnectWalletButton } from "@/app/common/components/ConnectWalletButton";
import Button from "@/app/common/components/Button";

const namespace = "frontend:Pay";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function Pay({
  paymentArgs,
  paymentCurrencyLoading,
}: {
  paymentArgs: Omit<PaymentArgs, "wallet">;
  paymentCurrencyLoading: boolean;
}) {
  const { status } = useAccount();
  const { clientWallet, clientWithStateManager } = useUserContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function txHashDetected() {
      setLoading(false);
    }
    clientWithStateManager.stateManager.orders.on("update", txHashDetected);

    return () => {
      clientWithStateManager.stateManager.orders.removeListener(
        "update",
        txHashDetected,
      );
    };
  }, []);

  async function sendPayment() {
    const paymentArgsWallet = { wallet: clientWallet, ...paymentArgs };
    try {
      setLoading(true);
      if (paymentArgs.currencyAddress !== addresses.zeroAddress) {
        debug("Pending ERC20 contract call approval");
        // TODO: should do this if we have already approved the contract
        await approveERC20(clientWallet, paymentArgsWallet.currency, [
          paymentArgsWallet.payeeAddress,
          paymentArgsWallet.amount,
        ]);
        debug("ERC20 contract call approved");
        await payTokenPreApproved(clientWallet, [paymentArgsWallet]);
      } else {
        //ETH payments do not need to be approved.
        debug("Pay native contract call");
        await payNative(clientWallet, [paymentArgsWallet]);
      }
    } catch (error) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error sending payment", error);
    }
  }

  return (
    <div>
      {status === "connected"
        ? (
          <div className="flex flex-col gap-4">
            <ConnectButton chainStatus="name" />
            <Button
              onClick={sendPayment}
              disabled={!paymentArgs || !clientWallet || loading ||
                paymentCurrencyLoading}
            >
              {loading ? <h6>Waiting for transaction...</h6> : <h6>Pay</h6>}
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