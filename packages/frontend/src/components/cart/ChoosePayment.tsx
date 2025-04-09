import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useChains } from "wagmi";
import {
  Address,
  type ContractFunctionArgs,
  createPublicClient,
  formatUnits,
  http,
  pad,
  toHex,
  zeroAddress,
} from "viem";

import { assert, logger } from "@massmarket/utils";
import { abi, getPaymentAddress, getPaymentId } from "@massmarket/contracts";
import {
  ChainAddress,
  Manifest,
  Order,
  OrderState,
  Payee,
} from "@massmarket/schema";

import Pay from "./Pay.tsx";
import QRScan from "./QRScan.tsx";
import TimerToast from "./TimerToast.tsx";
import Dropdown from "../common/CurrencyDropdown.tsx";
import BackButton from "../common/BackButton.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import ConnectWalletButton from "../common/ConnectWalletButton.tsx";
import { useShopId } from "../../hooks/useShopId.ts";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import { CheckoutStep, CurrencyChainOption } from "../../types.ts";
import { env, getTokenInformation } from "../../utils/mod.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";

const namespace = "frontend:ChoosePayment";
const debug = logger(namespace);
const errlog = logger(namespace, "error");
const paymentsByAddressAbi = abi.paymentsByAddressAbi;

export default function ChoosePayment({
  setStep,
  displayedAmount,
  setDisplayedAmount,
}: {
  setStep: (step: CheckoutStep) => void;
  displayedAmount: string | null;
  setDisplayedAmount: Dispatch<SetStateAction<string | null>>;
}) {
  const { shopId } = useShopId();
  const { currentOrder } = useCurrentOrder();
  const chains = useChains();
  const { stateManager } = useStateManager();

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

  useEffect(() => {
    if (!stateManager) return;
    stateManager.get(["Manifest"])
      .then((res: Map<string, unknown>) => {
        const m = Manifest.fromCBOR(res);
        getDisplayedChains(m).then((arr) => {
          setManifest(m);
          setChains(arr);
        });
      });
  }, [stateManager]);

  useEffect(() => {
    if (!stateManager) return;
    if (!currentOrder) return;
    //Listen for client to send paymentDetails event.
    function onPaymentDetails(res: Map<string, unknown>) {
      const order = Order.fromCBOR(res);
      if (!order.PaymentDetails) return;
      getPaymentArgs().then(() => {
        debug("paymentDetails found for order");
        setPaymentCurrencyLoading(false);
      });
    }

    stateManager.events.on(onPaymentDetails, ["Orders", currentOrder!.ID]);

    return () => {
      // Cleanup listeners on unmount
      stateManager.events.off(
        onPaymentDetails,
        ["Orders", currentOrder!.ID],
      );
    };
  }, [stateManager]);

  async function getPaymentArgs() {
    try {
      const oId = currentOrder!.ID;
      const committedOrder = Order.fromCBOR(
        await stateManager.get(["Orders", oId]) as Map<string, unknown>,
      );
      if (!committedOrder.ChosenPayee) {
        throw new Error("No chosen payee found");
      }
      const payee = committedOrder.ChosenPayee;
      if (!committedOrder.ChosenCurrency) {
        throw new Error("No chosen currency found");
      }
      const currency = committedOrder.ChosenCurrency;
      if (!committedOrder.PaymentDetails) {
        throw new Error("No payment details found");
      }
      const details = committedOrder.PaymentDetails;
      if (currency.ChainID !== payee.Address.ChainID) {
        throw new Error("Currency and payee chainId mismatch");
      }
      const chosenPaymentChain = chains.find(
        (chain) => currency.ChainID === chain.id,
      );
      if (!chosenPaymentChain) {
        throw new Error("No chosen payment chain found");
      }

      const paymentId = toHex(details.PaymentID, { size: 32 });

      //Create public client with correct chainId.
      const paymentRPC = createPublicClient({
        chain: chosenPaymentChain,
        transport: http(env.ethRPCUrl),
      });

      const [symbol, chosenCurrencyDecimals] = await getTokenInformation(
        paymentRPC,
        toHex(currency.Address, { size: 20 }),
      );
      //FIXME: get orderHash from paymentDetails.
      const zeros32Bytes = pad(zeroAddress, { size: 32 });
      const arg = {
        chainId: BigInt(currency.ChainID),
        ttl: BigInt(details.TTL),
        order: zeros32Bytes,
        currency: toHex(currency.Address, { size: 20 }),
        amount: BigInt(details.Total),
        payeeAddress: toHex(payee.Address.Address, { size: 20 }),
        isPaymentEndpoint: false,
        shopId: shopId!,
        shopSignature: toHex(new Uint8Array(64)),
      };

      const paymentAddr = await getPaymentAddress(paymentRPC, [
        arg,
        toHex(payee.Address.Address, { size: 20 }),
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
      const amount = BigInt(details.Total);
      debug(`amount: ${amount}`);
      const hexCurrency = toHex(currency.Address);
      const payLink = hexCurrency === zeroAddress
        ? `ethereum:${paymentAddr}?value=${amount}`
        : `ethereum:${hexCurrency}/transfer?address=${paymentAddr}&uint256=${amount}`;
      setPaymentAddress(paymentAddr);
      debug(`payment address: ${paymentAddr}`);
      setSrc(payLink);
      const displayedAmount = `${
        formatUnits(details.Total, chosenCurrencyDecimals)
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

  async function getDisplayedChains(manifest: Manifest) {
    // Only display chains that are in accepted currencies
    const currenciesMap = manifest.AcceptedCurrencies.asCBORMap();
    const displayed: CurrencyChainOption[] = [];

    for (const [id, addresses] of currenciesMap.entries()) {
      const chain = chains.find((chain) => chain.id === Number(id));
      if (!chain) continue;
      const tokenPublicClient = createPublicClient({
        chain,
        transport: http(env.ethRPCUrl),
      });
      for (const [address, _val] of addresses.entries()) {
        const res = await getTokenInformation(
          tokenPublicClient,
          toHex(address, { size: 20 }),
        );
        displayed.push({
          address,
          chainId: chain!.id,
          label: `${res[0]}/${chain!.name}`,
          value: `${address}/${chain!.id}`,
        });
      }
    }

    return displayed;
  }

  async function onSelectPaymentCurrency(selected: CurrencyChainOption) {
    if (!selected.chainId || !selected.address) {
      throw new Error("Invalid currency chain option");
    }
    if (!currentOrder) {
      throw new Error("No current order found");
    }
    try {
      setPaymentCurrencyLoading(true);
      //TODO: for now, just grab the first payee address in the map.
      const payeeAddresses = manifest.Payees.get(selected.chainId!);
      if (!payeeAddresses || payeeAddresses.size === 0) {
        throw new Error("No payee found in shop manifest");
      }
      const chosenCurrency = new ChainAddress(
        selected.chainId!,
        selected.address,
      );

      const payee = payeeAddresses.entries().next().value;
      if (!payee) {
        throw new Error("No payee found in shop manifest");
      }
      const chosenPayee = new Payee(
        new ChainAddress(selected.chainId, payee[0]),
        payee[1].CallAsContract,
      );
      await stateManager.set([
        "Orders",
        currentOrder.ID,
        "ChosenPayee",
        // @ts-ignore TODO: add BaseClass to CodecValue
      ], chosenPayee);
      await stateManager.set([
        "Orders",
        currentOrder.ID,
        "ChosenCurrency",
        // @ts-ignore TODO: add BaseClass to CodecValue
      ], chosenCurrency);
      await stateManager.set([
        "Orders",
        currentOrder.ID,
        "State",
      ], OrderState.PaymentChosen);
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
            {displayedChains && (
              <Dropdown
                label="Payment currency and chain"
                options={displayedChains}
                callback={onSelectPaymentCurrency}
                testId="chains-dropdown-select"
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
          <div
            data-testid="payment-details-loading"
            className={paymentCurrencyLoading ? "" : "hidden"}
          >
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
                className="rounded-lg flex flex-col items-center gap-2"
                style={{ backgroundColor: "transparent", padding: 0 }}
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
