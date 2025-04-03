import { useEffect, useState } from "react";
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useAccount, useConfig, usePublicClient, useWalletClient } from "wagmi";
import * as chains from "wagmi/chains";
import { simulateContract } from "@wagmi/core";
import { ContractFunctionArgs, zeroAddress } from "viem";

import { assert, logger } from "@massmarket/utils";
import { abi, approveERC20, getAllowance, pay } from "@massmarket/contracts";
import { Order } from "@massmarket/schema";

import Button from "../common/Button.tsx";
import BackButton from "../common/BackButton.tsx";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";
import { env } from "../../utils/env.ts";

const namespace = "frontend:Pay";
const debug = logger(namespace);
const errlog = logger(namespace, "error");
const {
  eddiesAbi,
  paymentsByAddressAbi,
  paymentsByAddressAddress,
} = abi;

export default function Pay({
  paymentArgs,
  paymentCurrencyLoading,
  goBack,
}: {
  paymentArgs: ContractFunctionArgs<
    typeof paymentsByAddressAbi,
    "nonpayable",
    "payTokenPreApproved"
  >;
  paymentCurrencyLoading: boolean;
  goBack: () => void;
}) {
  const addRecentTransaction = useAddRecentTransaction();
  const { connector } = useAccount();
  const { data: wallet } = useWalletClient();
  const { currentOrder } = useCurrentOrder();
  const { stateManager } = useStateManager();
  const paymentChainId = Number(paymentArgs?.[0]?.chainId || 1);
  const shopChainId = chains[env?.VITE_CHAIN_NAME as keyof typeof chains]?.id ??
    1;
  const shopPublicClient = usePublicClient({ chainId: shopChainId });
  const paymentPublicClient = usePublicClient({ chainId: paymentChainId });
  const config = useConfig();

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    function txHashDetected(o: Map<string, unknown>) {
      const order = Order.fromCBOR(o);
      if (order.TxDetails) {
        setTxHash(order.TxDetails?.TxHash ?? order.TxDetails?.BlockHash);
        addRecentTransaction({
          hash: order.TxDetails?.TxHash ?? order.TxDetails?.BlockHash,
          description: "Order Payment",
          // confirmations: 3,
        });
      }
      setLoading(false);
    }
    stateManager.events.on(txHashDetected, ["Orders", currentOrder!.ID]);

    return () => {
      stateManager.events.off(
        txHashDetected,
        ["Orders", currentOrder!.ID],
      );
    };
  }, [currentOrder]);

  async function sendPayment() {
    try {
      if (paymentArgs[0].currency !== zeroAddress) {
        debug("Pending ERC20 contract call approval");
        const allowance = await getAllowance(shopPublicClient!, [
          paymentArgs[0].payeeAddress,
          paymentArgs[0].currency,
        ]);
        if (allowance < paymentArgs[0].amount) {
          // This will throw error if simulate fails.
          await simulateContract(config, {
            abi: eddiesAbi,
            address: paymentArgs[0].currency,
            functionName: "approve",
            args: [
              paymentArgs[0].payeeAddress,
              paymentArgs[0].amount,
            ],
            connector,
          });
          await approveERC20(
            wallet!,
            wallet!.account,
            paymentArgs[0].currency,
            [
              paymentArgs[0].payeeAddress,
              paymentArgs[0].amount,
            ],
          );
          debug("ERC20 contract call approved");
        }
      }
      const res = await simulateContract(config, {
        abi: paymentsByAddressAbi,
        address: paymentsByAddressAddress,
        functionName: "pay",
        args: paymentArgs,
        ...(paymentArgs[0].currency === zeroAddress &&
          { value: paymentArgs[0].amount }),
        connector,
      });
      console.log({ res });
      const tx = await pay(wallet!, wallet!.account, paymentArgs);
      console.log({ tx });
      setLoading(true);
    } catch (error) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error sending payment", error);
    }
  }

  return (
    <section className="md:flex justify-center">
      <section className="md:w-[560px]">
        <BackButton onClick={goBack} />
        <section className="flex flex-col gap-4 bg-white p-5 rounded-lg mt-2">
          <h1>Connect your wallet</h1>
          <ConnectButton chainStatus="name" />
          <Button
            onClick={sendPayment}
            disabled={!paymentArgs || !wallet || loading ||
              paymentCurrencyLoading}
            custom="md:w-1/2"
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
        </section>
      </section>
    </section>
  );
}
