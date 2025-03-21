import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useChains } from "wagmi";
import {
  Address,
  type ContractFunctionArgs,
  createPublicClient,
  http,
  pad,
  toHex,
  zeroAddress,
} from "viem";

import { assert, formatUnitsFromString, logger } from "@massmarket/utils";
import { getPaymentAddress, getPaymentId } from "@massmarket/blockchain";
import { paymentsByAddressAbi } from "@massmarket/contracts";
import { ChainAddress, Manifest, Order, Payee } from "@massmarket/schema";

import Pay from "./Pay.tsx";
import QRScan from "./QRScan.tsx";
import TimerToast from "./TimerToast.tsx";
import Dropdown from "../common/CurrencyDropdown.tsx";
import BackButton from "../common/BackButton.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import ConnectWalletButton from "../common/ConnectWalletButton.tsx";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";
import { useShopId } from "../../hooks/useShopId.ts";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import { CheckoutStep, CurrencyChainOption } from "../../types.ts";
import { defaultRPC, getTokenInformation } from "../../utils/mod.ts";

const namespace = "frontend:ChoosePayment";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function ChoosePayment({
  setStep,
  displayedAmount,
  setDisplayedAmount,
}: {
  setStep: (step: CheckoutStep) => void;
  displayedAmount: string | null;
  setDisplayedAmount: Dispatch<SetStateAction<string | null>>;
}) {
  const { clientStateManager } = useClientWithStateManager();
  const { shopId } = useShopId();
  const { currentOrder } = useCurrentOrder();
  const chains = useChains();

  const [displayedChains, setChains] = useState<CurrencyChainOption[] | null>(
    null,
  );
  const [manifest, setManifest] = useState<Manifest>(new Manifest());
  const [paymentAddress, setPaymentAddress] = useState<Address | null>(null);
  const [imgSrc, setSrc] = useState<null | string>(null);
  const [qrOpen, setQrOpen] = useState<boolean>(false);
  const [connectWalletOpen, setConnectWalletOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [chosenPaymentTokenIcon, setIcon] = useState<string>(
    "/icons/usdc-coin.png",
  );
  const [paymentArgs, setPaymentArgs] = useState<
    | null
    | ContractFunctionArgs<
      typeof paymentsByAddressAbi,
      "nonpayable",
      "payTokenPreApproved"
    >
  >(
    null,
  );
  const [paymentCurrencyLoading, setPaymentCurrencyLoading] = useState(false);

  const sm = clientStateManager?.stateManager;

  useEffect(() => {
    if (!sm) return;
    sm.get(["Manifest"])
      .then((res: Map<string, unknown>) => {
        const m = new Manifest(res);
        getDisplayedChains(m).then((arr) => {
          setManifest(m);
          setChains(arr);
        });
      });
  }, [sm]);

  useEffect(() => {
    if (!sm) return;
    //Listen for client to send paymentDetails event.
    function onPaymentDetails(res: Map<string, unknown>) {
      const order = new Order(res);
      if (!order.PaymentDetails) return;
      getPaymentArgs().then(() => {
        debug("paymentDetails found for order");
        setPaymentCurrencyLoading(false);
      });
    }

    currentOrder!.orderId &&
      sm.events.on(onPaymentDetails, ["Orders", currentOrder!.orderId]);

    return () => {
      // Cleanup listeners on unmount
      sm.events.off(
        onPaymentDetails,
        ["Orders", currentOrder!.orderId],
      );
    };
  }, [sm]);

  async function getPaymentArgs() {
    try {
      const oId = currentOrder!.orderId;
      const committedOrder = await sm
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
      const paymentRPC = createPublicClient({
        chain: chosenPaymentChain,
        transport: http(defaultRPC),
      });

      const [symbol, decimal] = await getTokenInformation(
        paymentRPC,
        currency.address,
      );
      //FIXME: get orderHash from paymentDetails.
      const zeros32Bytes = pad(zeroAddress, { size: 32 });
      const arg = {
        chainId: currency.chainId,
        ttl: BigInt(ttl),
        order: zeros32Bytes,
        currency: currency.address,
        amount: BigInt(total),
        payeeAddress: payee.address,
        isPaymentEndpoint: false,
        shopId: shopId!,
        shopSignature,
      };

      const paymentAddr = await getPaymentAddress(paymentRPC, [
        arg,
        payee.address,
      ]);
      if (!paymentAddr) {
        throw new Error("No payment address found");
      }
      const id = await getPaymentId(paymentRPC, [arg]);

      if (toHex(id) !== paymentId) {
        debug(`received payment Id: ${paymentId}`);
        debug(`calculated payment Id: ${toHex(id)}`);
        throw new Error("Payment ID mismatch");
      }
      setPaymentArgs([arg]);
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
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error getting payment details", error as Error);
      setErrorMsg("Error getting payment details");
    }
  }

  function getDisplayedChains(manifest: Manifest) {
    const currenciesMap = manifest.AcceptedCurrencies.asCBORMap();
    const displayed: CurrencyChainOption[] = [];
    // This fn gets the token symbol and chain name to display to user instead of displaying token address and chain ID number
    chains.forEach((chain) => {
      if (!currenciesMap.has(chain.id)) return;
      const tokenPublicClient = createPublicClient({
        chain,
        transport: http(defaultRPC),
      });
      // all addresses in chain
      const c = currenciesMap.get(chain.id);
      c.keys().forEach(async (address) => {
        const res = await getTokenInformation(tokenPublicClient, address);
        displayed.push({
          address,
          chainId: chain.id,
          label: `${res[0]}/${chain.name}`,
          value: `${address}/${chain.id}`,
        });
      });
    });

    return displayed;
  }

  async function onSelectPaymentCurrency(selected: CurrencyChainOption) {
    try {
      setPaymentCurrencyLoading(true);
      const payeeAddresses = manifest.Payees.get(selected.chainId!);

      if (!payeeAddresses.size()) {
        throw new Error("No payee found in shop manifest");
      }
      //FIXME: for now, just grab the first payee address in the map.
      const payee = payeeAddresses.values().next().value;
      const chosenCurrency = new ChainAddress(
        new Map([["ChainID", selected.chainId!], [
          "Address",
          selected.address!,
        ]]),
      );
      const chosenPayee = new Payee(
        new Map([["Address", payee.Address], [
          "CallAsContract",
          payee.CallAsContract,
        ]]),
      );
      await sm.set([
        "Orders",
        currentOrder!.orderId,
        "ChosenPayee",
      ], chosenPayee.asCBORMap());
      await sm.set([
        "Orders",
        currentOrder!.orderId,
        "ChosenCurrency",
      ], chosenCurrency.asCBORMap());
      debug("chosen payment set");
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error setting chosen payment", error);
      setErrorMsg("Error setting chosen payment");
    }
  }

  function payByQr() {
    if (!displayedAmount) {
      setErrorMsg("Please select a payment currency");
      return;
    }
    setQrOpen(true);
  }

  function payWithWallet() {
    if (!displayedAmount) {
      setErrorMsg("Please select a payment currency");
      return;
    }
    setConnectWalletOpen(true);
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
  } else if (connectWalletOpen) {
    if (!paymentArgs) {
      setErrorMsg("No payment args found");
      return;
    }
    return (
      <Pay
        paymentArgs={paymentArgs}
        paymentCurrencyLoading={paymentCurrencyLoading}
        goBack={() => setConnectWalletOpen(false)}
      />
    );
  }

  return (
    <section data-testid="choose-payment" className="md:flex justify-center">
      <section className="md:w-[560px]">
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
        <h1 className="my-5">Choose payment method</h1>
        <TimerToast />
        <section className="mt-2 flex flex-col gap-4 bg-white rounded-lg p-5">
          <div data-testid="payment-currency">
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
          <div className={paymentCurrencyLoading ? "" : "hidden"}>
            <p>Getting payment details...</p>
          </div>
          <div
            data-testid="payment-methods"
            className="flex flex-col md:flex-row gap-4 justify-around"
          >
            <div className="flex items-center justify-center bg-background-gray p-5 rounded-lg">
              <ConnectWalletButton
                onClick={payWithWallet}
              />
            </div>
            <div className="flex items-center justify-center bg-background-gray p-5 rounded-lg">
              <button
                type="button"
                data-testid="pay-by-qr"
                className="rounded-lg flex flex-col items-center gap-2 bg-transparent p-0"
                onClick={payByQr}
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
    </section>
  );
}
