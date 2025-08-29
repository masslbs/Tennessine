import { useEffect, useState } from "react";
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
import { assert } from "@std/assert";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { getLogger } from "@logtape/logtape";
import { useRouter } from "@tanstack/react-router";

import {
  abi,
  getPaymentAddress,
  getPaymentId,
  getTokenInformation,
} from "@massmarket/contracts";
import {
  ChainAddress,
  Manifest,
  Order,
  OrderPaymentState,
  Payee,
  PayeeMetadata,
} from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";
import {
  useActiveOrder,
  useShopId,
  useStateManager,
} from "@massmarket/react-hooks";

import Pay from "./Pay.tsx";
import QRScan from "./QRScan.tsx";
import PriceSummary from "./PriceSummary.tsx";
import TimerToast from "./TimerToast.tsx";
import PaymentConfirmation from "./PaymentConfirmation.tsx";
import Dropdown from "../common/CurrencyDropdown.tsx";
import BackButton from "../common/BackButton.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import LoadingSpinner from "../common/LoadingSpinner.tsx";
import ConnectWalletButton from "../common/ConnectWalletButton.tsx";
import { CurrencyChainOption } from "../../types.ts";
import { env, getErrLogger } from "../../utils/mod.ts";

const baseLogger = getLogger(["mass-market", "frontend", "ChoosePayment"]);
const paymentsByAddressAbi = abi.paymentsByAddressAbi;

export default function ChoosePayment() {
  const router = useRouter();
  const { shopId } = useShopId();
  const { activeOrder, cancelAndRecreateOrder } = useActiveOrder();
  const chains = useChains();
  const { stateManager } = useStateManager();
  const addRecentTransaction = useAddRecentTransaction();

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
  const [displayedAmount, setDisplayedAmount] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<null | `0x${string}`>(null);
  const [blockHash, setBlockHash] = useState<null | `0x${string}`>(null);
  const logger = baseLogger.with({
    shopId,
    orderId: activeOrder?.ID,
  });
  const logError = getErrLogger(baseLogger, setErrorMsg);
  useEffect(() => {
    const unsubscribe = router.subscribe("onBeforeNavigate", () => {
      if (activeOrder && !activeOrder.TxDetails) {
        //TODO: if there is a payment in flight, then don't cancel the order.
        logger
          .info`User has navigated away from payment screen before completing payment for order: ${activeOrder.ID}.`;
        // If user navigates away from the payment screen without having paid, cancel and recreate the order.
        cancelAndRecreateOrder();
      }
    });

    return () => {
      unsubscribe();
    };
  });
  useEffect(() => {
    function onManifestUpdate(res: CodecValue) {
      const m = Manifest.fromCBOR(res);
      getDisplayedChains(m).then((arr) => {
        setManifest(m);
        setChains(arr);
      });
    }
    if (!stateManager) return;
    stateManager.get(["Manifest"])
      .then((res: CodecValue | undefined) => {
        if (!res || (res instanceof Map && res.size === 0)) {
          logger.error("No manifest found.");
          return;
        }
        onManifestUpdate(res);
      });

    stateManager.events.on(onManifestUpdate, ["Manifest"]);
  }, [stateManager]);

  useEffect(() => {
    if (!stateManager) return;
    if (!activeOrder) return;
    //Listen for client to send paymentDetails event.
    function onPaymentDetails() {
      getPaymentArgs().then(() => {
        logger.debug("paymentDetails found for order");
        setPaymentCurrencyLoading(false);
      });
    }

    function txHashDetected(order: Order) {
      if (order.TxDetails) {
        const tx = order.TxDetails.TxHash;
        const bh = order.TxDetails.BlockHash;
        assert(tx || bh, "No tx or bh");
        tx && setTxHash(toHex(tx));
        bh && setBlockHash(toHex(bh));
        logger.debug`Hash received: ${
          tx ? `Tx: ${toHex(tx)}` : bh ? `Block: ${toHex(bh)}` : "unreachable"
        }`;
        try {
          addRecentTransaction({
            hash: tx ? toHex(tx) : toHex(bh),
            description: "Order Payment",
            // confirmations: 3,
          });
        } catch (error) {
          logger.warn("Error adding recent transaction to rainbowkit", {
            error,
          });
        }
      }
    }
    function currentOrderUpdated(o: CodecValue) {
      const order = Order.fromCBOR(o);
      if (order.TxDetails) {
        txHashDetected(order);
      } else if (order.PaymentDetails) {
        onPaymentDetails();
      }
    }
    stateManager.events.on(currentOrderUpdated, ["Orders", activeOrder!.ID]);

    return () => {
      // Cleanup listeners on unmount
      stateManager.events.off(
        currentOrderUpdated,
        ["Orders", activeOrder!.ID],
      );
    };
  }, [stateManager, activeOrder]);

  useEffect(() => {
    // If there is only one currency option, automatically select it.
    if (
      displayedChains?.length === 1 && !paymentArgs && !paymentCurrencyLoading
    ) {
      logger.debug`Getting payment args for ${displayedChains[0].label}`;
      onSelectPaymentCurrency(displayedChains[0]);
    }
  }, [displayedChains]);

  async function getPaymentArgs() {
    if (!stateManager) {
      logger.warn("stateManager is undefined");
      return;
    }
    try {
      const oId = activeOrder!.ID;
      const order = await stateManager.get(["Orders", oId]);
      if (!order) {
        throw new Error(`order ${oId} not found`);
      }
      const committedOrder = Order.fromCBOR(order);
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

      const { symbol, decimal: chosenCurrencyDecimals } =
        await getTokenInformation(
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
        logger.debug`received payment Id: ${paymentId}`;
        logger.debug`calculated payment Id: ${toHex(id)}`;
        throw new Error("Payment ID mismatch");
      }
      setPaymentArgs([arg]);
      const amount = BigInt(details.Total);
      logger.debug`amount: ${amount}`;
      const hexCurrency = toHex(currency.Address);
      const payLink = hexCurrency === zeroAddress
        ? `ethereum:${paymentAddr}?value=${amount}`
        : `ethereum:${hexCurrency}/transfer?address=${paymentAddr}&uint256=${amount}`;
      setPaymentAddress(paymentAddr);
      logger.debug`payment address: ${paymentAddr}`;
      setSrc(payLink);
      const displayedAmount = `${
        formatUnits(amount, chosenCurrencyDecimals)
      } ${symbol}`;
      if (symbol === "ETH") {
        setIcon("/icons/eth-coin.svg");
      } else {
        setIcon("/icons/usdc-coin.png");
      }
      logger.debug`displayed amount: ${displayedAmount}`;
      setDisplayedAmount(displayedAmount);
    } catch (error: unknown) {
      logError("Error getting payment details", error);
    }
  }

  async function getDisplayedChains(manifest: Manifest) {
    // Only display chains that are in accepted currencies
    const currenciesMap = manifest.AcceptedCurrencies.data;
    const displayed: CurrencyChainOption[] = [];

    for (const [id, addresses] of currenciesMap.entries()) {
      const chain = chains.find((chain) => chain.id === Number(id));
      if (!chain) continue;
      const tokenPublicClient = createPublicClient({
        chain,
        transport: http(env.ethRPCUrl),
      });
      for (const [address, _val] of addresses.entries()) {
        const { symbol } = await getTokenInformation(
          tokenPublicClient,
          toHex(address, { size: 20 }),
        );
        displayed.push({
          address,
          chainId: chain!.id,
          label: `${symbol}/${chain!.name}`,
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
    if (!activeOrder) {
      throw new Error("No current order found");
    }
    if (!stateManager) {
      logger.warn("stateManager is undefined");
      return;
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

      const payee = payeeAddresses.entries().next().value as [
        Uint8Array,
        PayeeMetadata,
      ];
      if (!payee) {
        throw new Error("No payee found in shop manifest");
      }
      const chosenPayee = new Payee(
        new ChainAddress(selected.chainId, payee[0]),
        payee[1].CallAsContract,
      );
      await stateManager.set([
        "Orders",
        activeOrder.ID,
        "ChosenPayee",
      ], chosenPayee);
      await stateManager.set([
        "Orders",
        activeOrder.ID,
        "ChosenCurrency",
      ], chosenCurrency);
      await stateManager.set([
        "Orders",
        activeOrder.ID,
        "PaymentState",
      ], OrderPaymentState.PaymentChosen);
      logger.debug("chosen payment set");
    } catch (error: unknown) {
      logError("Error setting chosen payment", error);
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
  if (txHash || blockHash) {
    return (
      <PaymentConfirmation
        displayedAmount={displayedAmount!}
        txHash={txHash}
        blockHash={blockHash}
        paymentChain={chains.find((chain) =>
          chain.id === Number(paymentArgs![0]!.chainId!)
        )}
      />
    );
  } else if (qrOpen) {
    if (!imgSrc || !paymentAddress || !displayedAmount) {
      return <p>Loading...</p>;
    }
    return (
      <QRScan
        imgSrc={imgSrc}
        purchaseAddress={paymentAddress}
        displayedAmount={displayedAmount}
        goBack={() => setQrOpen(false)}
      />
    );
  } else if (connectWalletOpen) {
    return (
      <Pay
        displayedAmount={displayedAmount}
        tokenIcon={chosenPaymentTokenIcon}
        paymentArgs={paymentArgs!}
        paymentCurrencyLoading={paymentCurrencyLoading}
        goBack={() => setConnectWalletOpen(false)}
      />
    );
  } else if (!activeOrder) {
    return (
      <section data-testid="no-active-order" className="md:flex justify-center">
        <section className="md:w-[600px] px-4 md:px-0">
          <p>No order found</p>
        </section>
      </section>
    );
  }

  return (
    <section data-testid="choose-payment" className="md:flex justify-center">
      <section className="md:w-[600px] px-4 md:px-0">
        <BackButton />
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <h1 className="my-[10px]">Choose payment method</h1>
        <TimerToast />
        <section className="mt-2 flex flex-col gap-4 bg-white rounded-lg p-5">
          {displayedChains?.length && (
            <div data-testid="payment-currency">
              {displayedChains?.length === 1
                ? (
                  <div>
                    <h3>Payment currency and chain</h3>
                    <p>{displayedChains[0].label}</p>
                  </div>
                )
                : (
                  <Dropdown
                    label="Payment currency and chain"
                    options={displayedChains}
                    callback={onSelectPaymentCurrency}
                    testId="payment-currency-dropdown"
                  />
                )}
            </div>
          )}
          <PriceSummary
            displayedAmount={displayedAmount}
            tokenIcon={chosenPaymentTokenIcon}
          />
          <div
            data-testid="payment-details-loading"
            className={paymentCurrencyLoading
              ? "flex flex-col items-center gap-2"
              : "hidden"}
          >
            <p>Getting payment details...</p>
            <LoadingSpinner />
          </div>
          <section
            data-testid="payment-methods"
            className="flex gap-4 justify-center"
          >
            <div className="flex items-center justify-center bg-background-gray py-5 px-3 md:px-5 rounded-lg md:w-full">
              <ConnectWalletButton
                onClick={payWithWallet}
                disabled={!paymentArgs}
              />
            </div>
            <div className="flex items-center justify-center bg-background-gray py-5 px-3 md:px-5 rounded-lg md:w-full">
              <button
                type="button"
                data-testid="pay-by-qr"
                className={`rounded-lg flex flex-col items-center gap-2 ${
                  !paymentArgs ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: "transparent", padding: 0 }}
                onClick={payByQr}
                disabled={!paymentArgs}
              >
                <img
                  src="/icons/pay-by-QR.svg"
                  width={40}
                  height={40}
                  alt="wallet-icon"
                  className="w-13 h-10"
                />
                <div className="flex gap-[5px] items-center whitespace-nowrap">
                  <p className="whitespace-nowrap">Pay by QR code</p>
                  <img
                    src="/icons/chevron-right.svg"
                    width={12}
                    height={12}
                    alt="chevron"
                    className="w-2 h-2"
                  />
                </div>
              </button>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
}
