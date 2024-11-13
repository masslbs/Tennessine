import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useChains } from "wagmi";
import { Address, pad, toHex } from "viem";
import {
  assert,
  formatUnitsFromString,
  logger,
  zeroAddress,
} from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import {
  getPaymentAddressAndID,
  type PaymentArgs,
} from "@massmarket/blockchain";
import {
  CheckoutStep,
  CurrencyChainOption,
  Order,
  OrderEventTypes,
  OrderId,
  ShopCurrencies,
  ShopManifest,
} from "@/types";
import { createPublicClientForChain, getTokenInformation } from "@/app/utils";
import { useUserContext } from "@/context/UserContext";
import { useStoreContext } from "@/context/StoreContext";
import Dropdown from "@/app/common/components/CurrencyDropdown";
import BackButton from "@/app/common/components/BackButton";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import Pay from "@/app/components/transactions/Pay";
import QRScan from "./QRScan";

const namespace = "frontend:ChoosePayment";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function ChoosePayment({
  setStep,
  displayedAmount,
  setDisplayedAmount,
}: {
  setStep: Dispatch<SetStateAction<CheckoutStep>>;
  displayedAmount: string | null;
  setDisplayedAmount: Dispatch<SetStateAction<string | null>>;
}) {
  const { clientWithStateManager, shopId } = useUserContext();
  const { committedOrderId } = useStoreContext();
  const chains = useChains();

  const [displayedChains, setChains] = useState<CurrencyChainOption[] | null>(
    null,
  );
  const [manifest, setManifest] = useState<null | ShopManifest>(null);
  const [paymentAddress, setPaymentAddress] = useState<Address | null>(null);
  const [imgSrc, setSrc] = useState<null | string>(null);
  const [qrOpen, setQrOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [chosenPaymentTokenIcon, setIcon] = useState<string>(
    "/icons/usdc-coin.png",
  );
  const [paymentArgs, setPaymentArgs] = useState<
    null | Omit<PaymentArgs, "wallet">
  >(null);

  useEffect(() => {
    clientWithStateManager!
      .stateManager!.manifest.get()
      .then((manifest: ShopManifest) => {
        getDisplayedChains(manifest).then((arr) => {
          setManifest(manifest);
          setChains(arr);
        });
      });
  }, []);

  useEffect(() => {
    //Listen for client to send paymentDetails event.
    function onPaymentDetails(res: [OrderEventTypes, Order]) {
      const order = res[1];
      const type = res[0];
      if (
        order.id === committedOrderId &&
        type === OrderEventTypes.PAYMENT_DETAILS
      ) {
        getDetails(committedOrderId).then(() => {
          debug("paymentDetails found for order");
        });
      }
    }
    committedOrderId &&
      clientWithStateManager.stateManager.orders.on("update", onPaymentDetails);

    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager.stateManager.listings.removeListener(
        "update",
        onPaymentDetails,
      );
    };
  }, [committedOrderId]);

  async function getDetails(oId: OrderId) {
    try {
      const committedOrder = await clientWithStateManager.stateManager.orders
        .get(oId!);
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
      const { total, shopSignature, ttl, paymentId } =
        committedOrder.paymentDetails;
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
      //FIXME: get orderHash from paymentDetails.
      const zeros32Bytes = pad(abi.zeroAddress, { size: 32 });
      //FIXME: separate this into a function that constructs the arg.
      const arg = {
        chainId: currency.chainId,
        ttl: Number(ttl), // is this correct?
        orderHash: zeros32Bytes,
        currencyAddress: currency.address,
        total: BigInt(total),
        payeeAddress: payee.address,
        isPaymentEndpoint: false, //isPaymentEndpoint
        shopId: shopId!,
        shopSignature,
      };
      const calculatedPaymentInfo = await getPaymentAddressAndID(
        { wallet: paymentRPC, refundAddress: arg.payeeAddress, ...arg },
      );
      if (!calculatedPaymentInfo.address) {
        throw new Error("No payment address found");
      }
      if (toHex(calculatedPaymentInfo.id) !== paymentId) {
        debug(`received payment Id: ${paymentId}`);
        debug(`calculated payment Id: ${toHex(calculatedPaymentInfo.id)}`);
        throw new Error("Payment ID mismatch");
      }
      setPaymentArgs(arg);
      const paymentAddr = calculatedPaymentInfo.address;
      const amount = BigInt(total);
      debug(`amount: ${amount}`);
      const payLink = currency.address === zeroAddress
        ? `ethereum:${paymentAddr}?value=${amount}`
        : `ethereum:${currency.address}/transfer?address=${paymentAddr}&uint256=${amount}`;
      setPaymentAddress(paymentAddr);
      debug(`payment address: ${paymentAddr}`);
      setSrc(payLink);
      const displayedAmount = `${
        formatUnitsFromString(
          total,
          decimal,
        )
      } ${symbol}`;
      if (symbol === "ETH") {
        setIcon("/icons/eth-coin.svg");
      } else {
        setIcon("/icons/usdc-coin.png");
      }
      debug(`displayed amount: ${displayedAmount}`);
      setDisplayedAmount(displayedAmount);
      setStep(CheckoutStep.paymentDetails);
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error getting payment details", error as Error);
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
      const payee = manifest!.payees.find(
        (p) => p.chainId === selected.chainId,
      );
      if (!payee) {
        throw new Error("No payee found in shop manifest");
      }
      await clientWithStateManager.stateManager.orders.choosePayment(
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
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error setting chosen payment", error);
      setErrorMsg("Error setting chosen payment");
    }
  }
  if (qrOpen) {
    return (
      <QRScan
        imgSrc={imgSrc!}
        purchaseAddress={paymentAddress!}
        displayedAmount={displayedAmount!}
        goBack={() => setQrOpen(false)}
      />
    );
  }

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
            <img
              src={chosenPaymentTokenIcon}
              alt="coin"
              width={24}
              height={24}
              className="w-6 h-6 max-h-6"
            />
            <h1>{displayedAmount}</h1>
          </div>
        </div>
        <div>
          <div className="bg-background-gray p-5 rounded-lg">
            <Pay paymentArgs={paymentArgs} />
          </div>
          <div className="flex items-center justify-center bg-background-gray p-5 rounded-lg mt-5">
            <button
              data-testid="connect-wallet"
              className="rounded-lg flex flex-col items-center gap-2"
              onClick={() => setQrOpen(true)}
              disabled={!displayedAmount}
            >
              <img
                src="/icons/wallet-icon.svg"
                width={40}
                height={40}
                alt="wallet-icon"
                className="w-10 h-10 "
              />
              <div className="flex gap-2 items-center">
                <p>Pay by QR code</p>
                <img
                  src="/icons/chevron-right.svg"
                  width={12}
                  height={12}
                  alt="chevron"
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
