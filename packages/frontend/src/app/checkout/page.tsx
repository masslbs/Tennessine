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
import { OrderState, Order, OrderId } from "@/types";

import PaymentOptions from "@/app/components/checkout/PaymentOptions";
import * as abi from "@massmarket/contracts";
import CurrencyButton from "@/app/common/components/CurrencyButton";
import CurrencyChange from "@/app/common/components/CurrencyChange";
import { zeroAddress } from "@massmarket/contracts";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import debugLib from "debug";
import { formatUnitsFromString } from "@massmarket/utils";
import { getTokenInformation } from "@/app/utils";
import { useChains } from "wagmi";
import { createPublicClient, http, pad } from "viem";

const CheckoutFlow = () => {
  const { getOrderId, stateManager, selectedCurrency } = useStoreContext();
  const [step, setStep] = useState(0);
  const [imgSrc, setSrc] = useState<null | string>(null);

  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [cryptoTotal, setCryptoTotal] = useState<bigint | null>(null);
  const [purchaseAddress, setPurchaseAddr] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [postalCode, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [confirmedTxHash, setConfirmedTxHash] = useState<null | `0x${string}`>(
    null,
  );
  const [erc20Amount, setErc20Amount] = useState<null | string>(null);
  const [symbol, setSymbol] = useState<null | string>(null);
  const [openCurrencySelection, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const debug = debugLib("frontend:checkout");
  const chains = useChains();

  const currencyToggle = () => {
    setOpen(!openCurrencySelection);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(purchaseAddress!);
  };
  useEffect(() => {
    getOrderId()
      .then((id) => {
        if (id) {
          setOrderId(id);
          stateManager.orders
            .get(id)
            .then((order) => {
              setCurrentOrder(order);
            })
            .catch((e) => {
              debug(e);
            });
        }
      })
      .catch((e) => {
        debug(e);
      });
  }, []);

  useEffect(() => {
    const txHashDetected = (order: Order) => {
      if (order.id === orderId) {
        setCurrentOrder(order);
      }
    };

    stateManager.orders.on("addPaymentTx", txHashDetected);
    return () => {
      // Cleanup listeners on unmount
      stateManager.orders.removeListener("addPaymentTx", txHashDetected);
    };
  });

  useEffect(() => {
    if (currentOrder && currentOrder.status === OrderState.STATE_PAYMENT_TX) {
      const h = currentOrder.txHash as `0x${string}`;
      setOrderId(null);
      setConfirmedTxHash(h);
      setStep(3);
    }
  }, [currentOrder]);

  useEffect(() => {
    //Listen for client to send paymentDetails event.
    const onItemsFinalized = (order: Order) => {
      if (order.id === orderId) {
        getDetails(orderId);
      }
    };
    stateManager.orders.on("paymentDetails", onItemsFinalized);

    return () => {
      // Cleanup listeners on unmount
      stateManager.items.removeListener("paymentDetails", onItemsFinalized);
    };
  });

  const getDetails = (oId: OrderId) => {
    (async () => {
      const committedOrder = await stateManager.orders.get(oId!);
      const { currency, payee } = committedOrder.choosePayment!;
      const { total, shopSignature, ttl } = committedOrder.paymentDetails!;
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
      if (purchaseAdd) {
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
        setStep(2);
      }
    })();
  };

  const checkout = async () => {
    const orderId = await getOrderId();
    if (!orderId) {
      debug("orderId not found.");
      return;
    }
    if (!selectedCurrency) {
      setErrorMsg("Please select a currency to pay in.");
    } else {
      try {
        await stateManager.orders.updateShippingDetails(orderId, {
          name,
          address1: address,
          country,
          city,
          postalCode,
          phoneNumber,
          //TOOD: user input for email.
          emailAddress: "example@example.com",
        });
        const payee = await stateManager!.manifest.get();

        await stateManager!.orders.commit(orderId);
        await stateManager!.orders.choosePayment(orderId, {
          currency: selectedCurrency,
          //grab the first payee for now.
          payee: payee.payees[0],
        });
      } catch (error) {
        // If there was an error while committing, cancel the order.
        await stateManager!.orders.cancel(orderId);
        debug(error);
        setErrorMsg("Error while checking out order");
      }
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
          setPostal={setPostal}
          setCountry={setCountry}
          setNumber={setNumber}
        />
      );
    } else if (
      step === 2 &&
      imgSrc &&
      purchaseAddress &&
      cryptoTotal &&
      symbol
    ) {
      return (
        <PaymentOptions
          imgSrc={imgSrc}
          purchaseAddress={purchaseAddress}
          cryptoTotal={cryptoTotal}
          symbol={symbol}
          city={city}
          name={name}
          address={address}
          postalCode={postalCode}
          country={country}
          number={phoneNumber}
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
              <p data-testid="txHash">{confirmedTxHash}</p>
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
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
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
