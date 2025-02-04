import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient } from "wagmi";
import { ContractFunctionArgs } from "viem";

import * as abi from "@massmarket/contracts";
import { assert, logger } from "@massmarket/utils";
import { approveERC20, pay } from "@massmarket/blockchain";

import ConnectWalletButton from "../common/ConnectWalletButton.tsx";
import Button from "../common/Button.tsx";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";

const namespace = "frontend:Pay";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function Pay({
  paymentArgs,
  paymentCurrencyLoading,
}: {
  paymentArgs: ContractFunctionArgs<
    typeof abi.paymentsByAddressAbi,
    "nonpayable",
    "payTokenPreApproved"
  >;
  paymentCurrencyLoading: boolean;
}) {
  const { status } = useAccount();
  const { data: wallet } = useWalletClient();
  const { clientStateManager } = useClientWithStateManager();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function txHashDetected() {
      setLoading(false);
    }
    clientStateManager!.stateManager.orders.on("update", txHashDetected);

    return () => {
      clientStateManager!.stateManager.orders.removeListener(
        "update",
        txHashDetected,
      );
    };
  }, []);

  async function sendPayment() {
    try {
      setLoading(true);
      if (
        paymentArgs[0].currency !== abi.addresses.zeroAddress
      ) {
        debug("Pending ERC20 contract call approval");
        await approveERC20(wallet!, paymentArgs[0].currency, [
          paymentArgs[0].payeeAddress,
          paymentArgs[0].amount,
        ]);
        debug("ERC20 contract call approved");
      }
      await pay(wallet!, paymentArgs!);
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
              disabled={!paymentArgs || !wallet || loading ||
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
