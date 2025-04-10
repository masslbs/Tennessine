import { useEffect, useState } from "react";
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useAccount, useConfig, usePublicClient, useWalletClient } from "wagmi";
import * as chains from "wagmi/chains";
import { simulateContract } from "@wagmi/core";
import { ContractFunctionArgs, toHex, zeroAddress } from "viem";

import { assert, logger } from "@massmarket/utils";
import { abi, approveERC20, getAllowance, pay } from "@massmarket/contracts";
import { Order } from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";

import Button from "../common/Button.tsx";
import BackButton from "../common/BackButton.tsx";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";
import { env } from "../../utils/env.ts";
import { isTesting } from "../../utils/env.ts";

const namespace = "frontend:Pay";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

const defaultShopChainName = isTesting ? "hardhat" : "mainnet";
const configuredChainName = env?.VITE_CHAIN_NAME || defaultShopChainName;

const {
  eddiesAbi,
  paymentsByAddressAbi,
  paymentsByAddressAddress,
  // useSimulatePaymentsByAddressPay
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
  const paymentChainId = Number(paymentArgs?.[0]?.chainId);
  // TODO: might want to do this in a hook
  const shopChainId = chains[configuredChainName as keyof typeof chains]?.id;
  const shopPublicClient = usePublicClient({ chainId: shopChainId });
  const paymentPublicClient = usePublicClient({ chainId: paymentChainId });
  const config = useConfig();

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (!currentOrder) return;
    function txHashDetected(o: CodecValue) {
      const order = Order.fromCBOR(o);
      if (order?.TxDetails) {
        const hash = order.TxDetails?.TxHash
          ? toHex(order.TxDetails?.TxHash)
          : toHex(order.TxDetails?.BlockHash);
        debug(`txHashDetected: ${hash}`);
        setTxHash(hash);
        // TODO: are we sure this works for block hashes?
        addRecentTransaction({
          hash: hash,
          description: "Order Payment",
          // confirmations: 3,
        });
      }
      // TODO: shouldn't this be inside the if?
      setLoading(false);
    }
    stateManager.events.on(txHashDetected, ["Orders", currentOrder.ID]);

    return () => {
      stateManager.events.off(
        txHashDetected,
        ["Orders", currentOrder.ID],
      );
    };
  }, [currentOrder !== null]);

  async function sendPayment() {
    const isNative = paymentArgs[0].currency === zeroAddress;
    try {
      if (!isNative) {
        debug("Checking ERC20 allowance");
        const allowance = await getAllowance(paymentPublicClient!, [
          paymentArgs[0].payeeAddress,
          paymentArgs[0].currency,
        ]);
        if (allowance < paymentArgs[0].amount) {
          // This will throw an error if simulate fails.
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
          const hash = await approveERC20(
            wallet!,
            wallet!.account,
            paymentArgs[0].currency,
            [
              paymentArgs[0].payeeAddress,
              paymentArgs[0].amount,
            ],
          );
          await paymentPublicClient!.waitForTransactionReceipt({
            hash,
            // confirmations: 2,
            retryCount: 5,
          });
          debug("ERC20 allowance approved");
        }
      }
      const simArgs = {
        chainId: paymentChainId,
        abi: paymentsByAddressAbi,
        address: paymentsByAddressAddress,
        functionName: "pay" as const,
        args: paymentArgs,
        connector,
      };
      if (isNative) {
        // @ts-ignore "value" is not part of the abi
        simArgs.value = paymentArgs[0].amount;
      }
      await simulateContract(config, simArgs);
      const hash = await pay(wallet!, wallet!.account, paymentArgs);
      const receipt = await shopPublicClient!.waitForTransactionReceipt({
        hash,
        // confirmations: 2,
        retryCount: 5,
      });
      if (receipt!.status !== "success") {
        throw new Error("pay: transaction failed");
      }
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
              data-testid="tx-hash-link"
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
