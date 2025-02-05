import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConfig, usePublicClient, useWalletClient } from "wagmi";
import * as chains from "wagmi/chains";
import { simulateContract } from "@wagmi/core";
import { ContractFunctionArgs } from "viem";

import * as abi from "@massmarket/contracts";
import { assert, logger } from "@massmarket/utils";
import { approveERC20, getAllowance, pay } from "@massmarket/blockchain";

import ConnectWalletButton from "../common/ConnectWalletButton.tsx";
import Button from "../common/Button.tsx";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";
import { Order, OrderState } from "../../types.ts";

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
  const { status, connector } = useAccount();
  const { data: wallet } = useWalletClient();
  const { clientStateManager } = useClientWithStateManager();
  const paymentChainId = Number(paymentArgs?.[0]?.chainId || 1);
  const shopChainId =
    chains[import.meta.env?.VITE_CHAIN_NAME as keyof typeof chains]?.id ?? 1;
  const shopPublicClient = usePublicClient({ chainId: shopChainId });
  const paymentPublicClient = usePublicClient({ chainId: paymentChainId });
  const config = useConfig();

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    function txHashDetected(order: [OrderState, Order]) {
      if (order[1].txHash) {
        setTxHash(order[1].txHash);
      }
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
        const allowance = await getAllowance(shopPublicClient!, [
          paymentArgs[0].payeeAddress,
          paymentArgs[0].currency,
        ]);
        let amount = paymentArgs[0].amount;
        if (allowance < paymentArgs[0].amount) {
          amount = paymentArgs[0].amount - allowance;
        }
        // This will throw error if simulate fails.
        await simulateContract(config, {
          abi: abi.eddiesAbi,
          address: paymentArgs[0].currency,
          functionName: "approve",
          args: [
            paymentArgs[0].payeeAddress,
            amount,
          ],
          connector,
        });
        await approveERC20(wallet!, paymentArgs[0].currency, [
          paymentArgs[0].payeeAddress,
          amount,
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
            {txHash && (
              <a
                href={`${
                  paymentPublicClient!.chain.blockExplorers?.default?.url
                }/tx/${txHash}`}
              >
                View TX
              </a>
            )}
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
