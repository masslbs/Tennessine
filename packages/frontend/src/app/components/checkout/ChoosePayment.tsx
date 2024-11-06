import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useChains } from "wagmi";
import { pad } from "viem";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";
import { formatUnitsFromString, logger } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import { zeroAddress } from "@massmarket/contracts";

import {
  ShopCurrencies,
  ShopManifest,
  OrderState,
  OrderId,
  Order,
  CurrencyChainOption,
  CheckoutStep,
} from "@/types";
import { getTokenInformation, createPublicClientForChain } from "@/app/utils";
import { useUserContext } from "@/context/UserContext";
import { useStoreContext } from "@/context/StoreContext";
import Dropdown from "@/app/common/components/CurrencyDropdown";
import BackButton from "@/app/common/components/BackButton";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import QRScan from "./QRScan";
import SendTransaction from "@/app/components/transactions/SendTransaction";

const debug = logger("frontend:ChoosePayment");
const log = logger("frontend:ChoosePayment", "info");
const warn = logger("frontend:ChoosePayment", "warn");

export default function ChoosePayment({
  setStep,
  displayedAmount,
  setDisplayedAmount,
}: {
  setStep: Dispatch<SetStateAction<CheckoutStep>>;
  displayedAmount: string | null;
  setDisplayedAmount: Dispatch<SetStateAction<string | null>>;
}) {
  const { clientWithStateManager } = useUserContext();
  const { committedOrderId } = useStoreContext();
  const chains = useChains();

  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [displayedChains, setChains] = useState<CurrencyChainOption[] | null>(
    null,
  );
  const [manifest, setManifest] = useState<null | ShopManifest>(null);
  const [cryptoTotal, setCryptoTotal] = useState<bigint | null>(null);
  const [purchaseAddress, setPurchaseAddr] = useState<string | null>(null);
  const [imgSrc, setSrc] = useState<null | string>(null);
  const [qrOpen, setQrOpen] = useState<boolean>(false);

  useEffect(() => {
    clientWithStateManager!
      .stateManager!.manifest.get()
      .then((manifest: ShopManifest) => {
        getDisplayedChains(manifest)
          .then((arr) => {
            setManifest(manifest);
            setChains(arr);
          })
      })
  }, []);

  useEffect(() => {
    //Listen for client to send paymentDetails event.
    function onPaymentDetails(order: Order) {
      if (order.id === committedOrderId) {
        getDetails(committedOrderId)
          .then(() => {
            log("paymentDetails found for order");
          })
      }
    }
    committedOrderId &&
      clientWithStateManager!.stateManager!.orders.on(
        "paymentDetails",
        onPaymentDetails,
      );

    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager!.stateManager!.listings.removeListener(
        "paymentDetails",
        onPaymentDetails,
      );
    };
  }, [committedOrderId]);

  async function getDetails(oId: OrderId) {
    try {
      const committedOrder =
        await clientWithStateManager!.stateManager!.orders.get(oId!);
      if (!committedOrder?.choosePayment) {
        throw new Error("No chosen payment found");
      }
      if (!committedOrder?.paymentDetails) {
        throw new Error("No payment details found");
      }
      const { currency, payee } = committedOrder.choosePayment;
      if (currency.chainId !== payee.chainId) {
        throw new Error("Currency and payee chainId mismatch");
      }
      const { total, shopSignature, ttl } = committedOrder.paymentDetails;
      const chosenPaymentChain = chains.find(
        (chain) => currency.chainId === chain.id,
      );
      if (!chosenPaymentChain) {
        throw new Error("No chosen payment chain found");
      }
      //Create public client with correct chainId.
      const paymentRPC = createPublicClientForChain(chosenPaymentChain);

      const [symbol, decimal] = await getTokenInformation(
        paymentRPC,
        currency.address,
      );

      const manifest =
        await clientWithStateManager!.stateManager!.manifest.get();
      //FIXME: get orderHash from paymentDetails.
      const zeros32Bytes = pad(zeroAddress, { size: 32 });

      const arg = [
        currency.chainId,
        ttl,
        zeros32Bytes,
        currency.address,
        BigInt(total),
        payee.address,
        false, //isPaymentEndpoint
        manifest.tokenId,
        shopSignature,
      ];
      const purchaseAdd = await paymentRPC.readContract({
        address: abi.addresses.Payments as `0x${string}`,
        abi: abi.PaymentsByAddress,
        functionName: "getPaymentAddress",
        args: [arg, payee.address],
      });
      if (!purchaseAdd) throw new Error("No purchase address found");
      const amount = BigInt(total);
      const payLink =
        currency.address === zeroAddress
          ? `ethereum:${purchaseAdd}?value=${amount}`
          : `ethereum:${currency.address}/transfer?address=${purchaseAdd}&uint256=${amount}`;
      setPurchaseAddr(purchaseAdd as `0x${string}`);
      setSrc(payLink);
      setCryptoTotal(amount);
      // TODO: pass cryptoTotal to walletConnect
      console.log(cryptoTotal);

      setDisplayedAmount(`${formatUnitsFromString(total, decimal)} ${symbol}`);
      setStep(CheckoutStep.paymentDetails);
    } catch (error) {
      warn("Error getting payment details");
      Sentry.captureException(error);
      setErrorMsg("Error getting payment details");
    }
  }

  function getDisplayedChains(manifest: ShopManifest) {
    // This fn gets the token symbol and chain name to display to user instead of displaying token address and chain ID number
    return Promise.all(
      manifest.acceptedCurrencies.map(async (ac: ShopCurrencies) => {
        const chain = chains.find((chain) => ac.chainId === chain.id);
        if (!chain) {
          throw new Error("Chain not found");
        }
        const tokenPublicClient = createPublicClientForChain(chain);
        const res = await getTokenInformation(tokenPublicClient, ac.address);
        return {
          address: ac.address,
          chainId: ac.chainId,
          label: `${res[0]}/${chain.name}`,
          value: `${ac.address}/${ac.chainId}`,
        };
      }),
    );
  }
  async function onSelectPaymentCurrency(selected: CurrencyChainOption) {
    try {
      const committed =
        await clientWithStateManager!.stateManager!.orders.getStatus(
          OrderState.STATE_COMMITED,
        );
      if (!committed) {
        throw new Error("No committed order found");
      }
      if (!committed.length) {
        throw new Error("Committed order not found");
      } else if (committed.length > 1) {
        throw new Error("Multiple committed orders found");
      }
      const committedOrderId = committed[0];
      const payee = manifest!.payees[0];
      if (!payee) {
        throw new Error("No payee found in shop manifest");
      }
      await clientWithStateManager!.stateManager!.orders.choosePayment(
        committedOrderId,
        {
          currency: {
            address: selected.address!,
            chainId: selected.chainId!,
          },
          payee,
        },
      );
      debug("chosen payment set");
    } catch (error) {
      Sentry.captureException(error);
      warn("Error choosing payment");
      setErrorMsg("Error choosing payment");
    }
  }
  if (qrOpen)
    return (
      <QRScan
        imgSrc={imgSrc!}
        purchaseAddress={purchaseAddress!}
        displayedAmount={displayedAmount!}
        goBack={() => setQrOpen(false)}
      />
    );

  return (
    <section>
      <BackButton
        onClick={() => {
          setStep(CheckoutStep.shippingDetails);
        }}
      />
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      <div className="flex">
        <h1>Choose payment method</h1>
      </div>
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
        <div>
          <label>Payment currency and chain</label>
          {displayedChains && (
            <Dropdown
              options={displayedChains}
              callback={onSelectPaymentCurrency}
            />
          )}
        </div>
        <div className={displayedAmount ? "" : "hidden"}>
          <p>Total Price</p>
          <div className="flex items-center gap-2">
            <Image
              src="/icons/usdc-coin.png"
              alt="coin"
              width={24}
              height={24}
              unoptimized={true}
              className="w-6 h-6 max-h-6"
            />
            <h1>{displayedAmount}</h1>
          </div>
        </div>
        <div>
          <div className="bg-background-gray p-5 rounded-lg">
            <SendTransaction
              purchaseAddress={purchaseAddress}
              cryptoTotal={cryptoTotal}
            />
          </div>
          <div className="flex items-center justify-center bg-background-gray p-5 rounded-lg mt-5">
            <button
              data-testid="connect-wallet"
              className="rounded-lg flex flex-col items-center gap-2"
              onClick={() => setQrOpen(true)}
            >
              <Image
                src="/icons/wallet-icon.svg"
                width={40}
                height={40}
                alt="wallet-icon"
                unoptimized={true}
                className="w-10 h-10 "
              />
              <div className="flex gap-2 items-center">
                <p>Pay by QR code</p>
                <Image
                  src="/icons/chevron-right.svg"
                  width={12}
                  height={12}
                  alt="chevron"
                  unoptimized={true}
                  className="w-3 h-3"
                />
              </div>
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
