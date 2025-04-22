import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useChainId,
  useConfig,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import * as chains from "wagmi/chains";
import { simulateContract } from "@wagmi/core";
import { ContractFunctionArgs, zeroAddress } from "viem";

import { logger } from "@massmarket/utils";
import { abi, approveERC20, getAllowance, pay } from "@massmarket/contracts";

import Button from "../common/Button.tsx";
import BackButton from "../common/BackButton.tsx";
import { env } from "../../utils/env.ts";
import { isTesting } from "../../utils/env.ts";
import ErrorMessage from "../common/ErrorMessage.tsx";

const namespace = "frontend:Pay";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

const defaultShopChainName = isTesting ? "hardhat" : "mainnet";
const configuredChainName = env.chainName || defaultShopChainName;

const {
  eddiesAbi,
  paymentsByAddressAbi,
  paymentsByAddressAddress,
} = abi;

export default function Pay({
  paymentArgs,
  paymentCurrencyLoading,
  goBack,
  setTimerRunning,
}: {
  paymentArgs: ContractFunctionArgs<
    typeof paymentsByAddressAbi,
    "nonpayable",
    "payTokenPreApproved"
  >;
  paymentCurrencyLoading: boolean;
  goBack: () => void;
  setTimerRunning: (running: boolean) => void;
}) {
  const { connector } = useAccount();
  const { data: wallet } = useWalletClient();
  const chainId = useChainId();

  const paymentChainId = Number(paymentArgs?.[0]?.chainId);
  // TODO: might want to do this in a hook
  const shopChainId = chains[configuredChainName as keyof typeof chains]?.id;
  const shopPublicClient = usePublicClient({ chainId: shopChainId });
  const paymentPublicClient = usePublicClient({ chainId: paymentChainId });
  const config = useConfig();
  const { switchChain } = useSwitchChain({ config });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  useEffect(() => {
    if (wallet?.account) {
      if (chainId !== paymentChainId) {
        debug(`Switching chain from ${chainId} to ${paymentChainId}`);
        switchChain({ chainId: paymentChainId });
      }
      //if wallet changes, reset loading and error message
      setLoading(false);
      setErrorMsg(null);
    }
  }, [wallet]);

  async function sendPayment() {
    const isNative = paymentArgs[0].currency === zeroAddress;
    try {
      setLoading(true);
      //pause timer if user is paying.
      setTimerRunning(false);

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
    } catch (error: unknown) {
      // @ts-ignore TODO: fix this
      if (error.shortMessage) {
        // @ts-ignore TODO: fix this
        setErrorMsg(error.shortMessage);
      }
      errlog("Error sending payment", error);
    }
  }

  return (
    <main className="md:flex justify-center">
      <section className="md:w-[800px]">
        <BackButton onClick={goBack} />
        <div className="my-3">
          <ErrorMessage
            errorMessage={errorMsg}
            onClose={() => {
              setErrorMsg(null);
            }}
          />
        </div>

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
        </section>
      </section>
    </main>
  );
}
