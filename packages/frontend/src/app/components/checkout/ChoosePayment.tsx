import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useChains } from "wagmi";
import { createPublicClient, http, pad } from "viem";
import Image from "next/image";
import debugLib from "debug";

import { formatUnitsFromString } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import { zeroAddress } from "@massmarket/contracts";

import {
  ShopCurrencies,
  ShopManifest,
  OrderState,
  OrderId,
  Order,
  CurrencyChainOption,
} from "@/types";
import { getTokenInformation } from "@/app/utils";
import { useStoreContext } from "@/context/StoreContext";
import Dropdown from "@/app/common/components/CurrencyDropdown";
import { ConnectWalletButton } from "@/app/common/components/ConnectWalletButton";
import BackButton from "@/app/common/components/BackButton";

export default function ChoosePayment({
  setStep,
}: {
  setStep: Dispatch<
    SetStateAction<
      "cart" | "shipping details" | "payment details" | "confirmation"
    >
  >;
}) {
  const [displayedChains, setChains] = useState<CurrencyChainOption[] | null>(
    null,
  );
  const [manifest, setManifest] = useState<null | ShopManifest>(null);
  const [symbol, setSymbol] = useState<null | string>(null);
  const [cryptoTotal, setCryptoTotal] = useState<bigint | null>(null);
  const [purchaseAddress, setPurchaseAddr] = useState<string | null>(null);
  const [erc20Amount, setErc20Amount] = useState<null | string>(null);
  const [imgSrc, setSrc] = useState<null | string>(null);
  const [orderId, setOrderId] = useState<OrderId | null>(null);

  const { stateManager } = useStoreContext();
  const chains = useChains();
  const debug = debugLib("frontend:ChoosePayment");
  const log = debugLib("frontend:ChoosePayment");
  log.color = "242";

  useEffect(() => {
    stateManager.orders
      .getStatus(OrderState.STATE_COMMITED)
      // @ts-expect-error FIXME: frontend currently cannot infer type from stateManager. Is this fixed with Deno?
      .then((committed: OrderId[]) => {
        if (!committed) {
          throw new Error("No committed order found");
        }
        if (!committed.length) {
          throw new Error("Committed order not found");
        } else if (committed.length > 1) {
          throw new Error("Multiple committed orders");
        }
        setOrderId(committed[0]);
      })
      .catch((e) => debug(e));
  }, []);

  useEffect(() => {
    stateManager.manifest
      .get()
      .then((manifest: ShopManifest) => {
        getDisplayedChains(manifest)
          .then((arr) => {
            setManifest(manifest);
            setChains(arr);
          })
          .catch((e) => debug(e));
      })
      .catch((e) => debug(e));
  }, []);

  useEffect(() => {
    //Listen for client to send paymentDetails event.
    function onPaymentDetails(order: Order) {
      console.log("paymentDetails", order);
      if (order.id === orderId) {
        log("paymentDetails found for order");
        getDetails(orderId)
          .then()
          .catch((e) => debug(e));
      }
    }
    console.log({ orderId });
    orderId && stateManager.orders.on("paymentDetails", onPaymentDetails);

    return () => {
      // Cleanup listeners on unmount
      stateManager.items.removeListener("paymentDetails", onPaymentDetails);
    };
  }, [orderId]);

  async function getDetails(oId: OrderId) {
    try {
      const committedOrder = await stateManager.orders.get(oId!);
      if (!committedOrder?.choosePayment) {
        throw new Error("No chosen payment found");
      }
      if (!committedOrder?.paymentDetails) {
        throw new Error("No payment details found");
      }
      const { currency, payee } = committedOrder.choosePayment;
      const { total, shopSignature, ttl } = committedOrder.paymentDetails;
      const chosenPaymentChain = chains.find(
        (chain) => currency.chainId === chain.id,
      );
      //Create public client with correct chainId.
      const chosenPaymentPublicClient = createPublicClient({
        chain: chosenPaymentChain,
        transport: http(),
      });

      const [symbol, decimal] = await getTokenInformation(
        chosenPaymentPublicClient,
        currency.address,
      );
      setSymbol(symbol);

      const payeeChain = chains.find((chain) => payee.chainId === chain.id);
      const paymentRPC = createPublicClient({
        chain: payeeChain,
        transport: http(),
      });
      const manifest = await stateManager.manifest.get();
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
      const displayedErc20 = formatUnitsFromString(total, decimal);
      const payLink =
        currency.address === zeroAddress
          ? `ethereum:${purchaseAdd}?value=${amount}`
          : `ethereum:${currency.address}/transfer?address=${purchaseAdd}&uint256=${amount}`;
      setPurchaseAddr(purchaseAdd as `0x${string}`);
      setSrc(payLink);
      setCryptoTotal(amount);
      setErc20Amount(displayedErc20);
      setStep("payment details");
    } catch (error) {
      debug(error);
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
        const tokenPublicClient = createPublicClient({
          chain,
          transport: http(),
        });
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
      const committed = await stateManager?.orders.getStatus(
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
      await stateManager!.orders.choosePayment(committedOrderId, {
        currency: {
          address: selected.address!,
          chainId: selected.chainId!,
        },
        payee,
      });
      log("Chosen payment set");
    } catch (error) {
      debug(error);
    }
  }

  return (
    <section>
      <BackButton
        onClick={() => {
          setStep("shipping details");
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
        <div>
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
            <h1>total</h1>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="bg-background-gray p-5 rounded-lg">
            <ConnectWalletButton />
          </div>
          <div className="bg-background-gray p-5 rounded-lg">
            <button
              data-testid="connect-wallet"
              className="rounded-lg flex flex-col items-center gap-2"
            >
              <Image
                src="/icons/wallet-icon.svg"
                width={40}
                height={40}
                alt="wallet-icon"
                unoptimized={true}
              />
              <div className="flex gap-2">
                <p>Pay by QR code</p>
                <Image
                  src="/icons/chevron-right.svg"
                  width={5}
                  height={5}
                  alt="chevron"
                  unoptimized={true}
                />
              </div>
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
