// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import ProgressBar from "@/app/components/checkout/ProgressBar";
import React, { useEffect, useState } from "react";
import { useStoreContext } from "@/context/StoreContext";
import NewCart from "@/app/cart/NewCart";
import ShippingDetails from "@/app/components/checkout/ShippingDetails";
import Image from "next/image";
import { OrderFinalized, Status, Order, TokenAddr } from "@/types";
import { OrderId } from "@/context/types";

import PaymentOptions from "@/app/components/checkout/PaymentOptions";
import { useMyContext } from "@/context/MyContext";
import * as abi from "@massmarket/contracts";
import CurrencyButton from "@/app/common/components/CurrencyButton";
import CurrencyChange from "@/app/common/components/CurrencyChange";
import { zeroAddress } from "@massmarket/contracts";

const CheckoutFlow = () => {
  const { getOrderId, stateManager, selectedCurrency } = useStoreContext();
  const { publicClient, shopId, getTokenInformation } = useMyContext();
  const [step, setStep] = useState(0);

  const [imgSrc, setSrc] = useState<null | string>(null);
  const [checkoutReqId, setCheckoutRequestId] = useState<`0x${string}` | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [cryptoTotal, setCryptoTotal] = useState<number | null>(null);
  const [purchaseAddress, setPurchaseAddr] = useState<string | null>(null);
  const [totalDollar, setTotalDollar] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [number, setNumber] = useState("");
  const [confirmedTxHash, setConfirmedTxHash] = useState<null | `0x${string}`>(
    null,
  );
  const [erc20Amount, setErc20Amount] = useState<null | number>(null);
  const [symbol, setSymbol] = useState<null | string>(null);
  const [openCurrencySelection, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const currencyToggle = () => {
    setOpen(!openCurrencySelection);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(purchaseAddress!);
  };
  useEffect(() => {
    (async () => {
      const id = await getOrderId();
      const o = await stateManager.orders.get(id);
      setOrderId(id);
      setCurrentOrder(o);
    })();
  }, []);

  useEffect(() => {
    if (currentOrder?.status === Status.Complete) {
      const h = currentOrder.txHash as `0x${string}`;
      setOrderId(null);
      setConfirmedTxHash(h);
      setStep(3);
    }
  }, [currentOrder]);

  useEffect(() => {
    if (checkoutReqId && orderId) {
      (async () => {
        const committed = await stateManager.orders.get(orderId);
        const {
          ttl,
          orderHash,
          currencyAddr,
          totalInCrypto,
          payeeAddr,
          shopSignature,
          total,
        } = committed.orderFinalized as OrderFinalized;
        // Find the chainId for the currencyAddr used from shopManifest.
        const manifest = await stateManager.manifest.get();
        const curr = manifest.acceptedCurrencies.find(
          (c) => c.tokenAddr === currencyAddr,
        );
        const arg = [
          curr?.chainId,
          ttl,
          orderHash,
          currencyAddr,
          totalInCrypto,
          payeeAddr,
          false,
          shopId,
          shopSignature,
        ];
        const ownerAdd = await publicClient!.readContract({
          address: abi.addresses.ShopReg as `0x${string}`,
          abi: abi.ShopReg,
          functionName: "ownerOf",
          args: [shopId],
        });
        const purchaseAdd = await publicClient!.readContract({
          address: abi.addresses.Payments as `0x${string}`,
          abi: abi.PaymentsByAddress,
          functionName: "getPaymentAddress",
          args: [arg, ownerAdd],
        });
        const { decimals, symbol } = await getTokenInformation(
          currencyAddr as TokenAddr,
        );
        setSymbol(symbol);
        if (purchaseAdd) {
          const amount = Number(totalInCrypto);
          const _erc20Amount = amount / Math.pow(10, decimals);
          const payLink =
            currencyAddr === zeroAddress
              ? `ethereum:${purchaseAdd}?value=${amount}`
              : `ethereum:${currencyAddr}/transfer?address=${purchaseAdd}&uint256=${amount}`;
          setPurchaseAddr(purchaseAdd as `0x${string}`);
          setSrc(payLink);
          setCryptoTotal(amount);
          setErc20Amount(_erc20Amount);
          setTotalDollar(total);
          setStep(2);
        }
      })();
    }
  }, [checkoutReqId]);

  const checkout = async () => {
    const orderId = await getOrderId();
    try {
      const checkout = await stateManager.orders.commit(
        orderId,
        selectedCurrency.tokenAddr,
        selectedCurrency.chainId,
        "default",
      );
      setCheckoutRequestId(checkout.orderFinalizedId);
    } catch (error) {
      // If there was an error while committing, cancel the order.
      await stateManager.orders.cancel(orderId, 0);
      setErrorMsg("Error while checking out order");
    }
  };

  const renderContent = () => {
    if (step === 0) {
      return (
        <NewCart
          next={() => {
            setStep(1);
            currencyToggle();
          }}
          orderId={orderId}
        />
      );
    } else if (step === 1) {
      return (
        <ShippingDetails
          checkout={checkout}
          setCity={setCity}
          setName={setName}
          setAddress={setAddress}
          setZip={setZip}
          setCountry={setCountry}
          setNumber={setNumber}
        />
      );
    } else if (
      step === 2 &&
      imgSrc &&
      totalDollar &&
      purchaseAddress &&
      cryptoTotal
    ) {
      return (
        <PaymentOptions
          imgSrc={imgSrc}
          totalDollar={totalDollar}
          purchaseAddress={purchaseAddress}
          cryptoTotal={cryptoTotal}
          symbol={symbol}
          city={city}
          name={name}
          address={address}
          zip={zip}
          country={country}
          number={number}
          erc20Amount={erc20Amount}
        />
      );
    } else {
      return (
        <div className="text-center">
          <h2>Thank you</h2>
          <div className="flex-col items-center gap-2 flex">
            <p>Tx hash:</p>
            <div className="bg-white w-fit p-2 border-2 rounded-xl shadow-lg flex gap-2">
              <p>{confirmedTxHash?.slice(0, 20)}...</p>
              <button onClick={copyToClipboard}>
                <Image
                  src={"/assets/copy-icon.svg"}
                  width={15}
                  height={15}
                  alt="item-thumbnail"
                  unoptimized={true}
                />
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="pt-under-nav h-screen bg-gray-100 ">
      {/* FIXME: need banner design for errors */}
      {errorMsg && errorMsg}
      <div className="px-4">
        <CurrencyButton toggle={currencyToggle} />
        <CurrencyChange open={openCurrencySelection} />
      </div>

      <div className="px-5">
        <div>
          <ProgressBar
            allSteps={["Review Cart", "Shipping Details", "Payment", "Success"]}
            currentStep={step}
          />
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default CheckoutFlow;
