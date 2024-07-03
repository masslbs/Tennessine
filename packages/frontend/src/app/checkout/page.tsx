"use client";
import ProgressBar from "@/app/components/checkout/ProgressBar";
import React, { useEffect, useState } from "react";
import { useStoreContext } from "@/context/StoreContext";
import NewCart from "@/app/cart/NewCart";
import ShippingDetails from "@/app/components/checkout/ShippingDetails";
import Image from "next/image";
import { IStatus } from "@/types";
import PaymentOptions from "@/app/components/checkout/PaymentOptions";
import { useMyContext } from "@/context/MyContext";
import * as abi from "@massmarket/contracts";
import { useChainId } from "wagmi";
import { bytesToHex, bytesToNumber } from "viem";

const CheckoutFlow = () => {
  const { commitOrder, finalizedOrders, orderItems, orderId, setOrderId } =
    useStoreContext();
  const { publicClient, shopId, getTokenInformation } = useMyContext();
  const [step, setStep] = useState(0);

  const [imgSrc, setSrc] = useState<null | string>(null);
  const [checkoutReqId, setCheckoutRequestId] = useState<`0x${string}` | null>(
    null,
  );
  const [showErrorMessage, setShowErrorMessage] = useState<null | string>(null);
  const [cryptoTotal, setCryptoTotal] = useState<number | null>(null);
  const [purchaseAddress, setPurchaseAdd] = useState<string | null>(null);
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
  const chainId = useChainId();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(purchaseAddress!);
  };
  useEffect(() => {
    if (
      orderItems &&
      orderId &&
      orderItems.get(orderId)?.status === IStatus.Complete
    ) {
      const h = orderItems.get(orderId)?.txHash as `0x${string}`;
      setOrderId(null);
      setConfirmedTxHash(h);
      setStep(3);
    }
  }, [orderItems]);

  useEffect(() => {
    if (finalizedOrders.size && checkoutReqId) {
      const currentCart = finalizedOrders.get(checkoutReqId);
      if (!currentCart) return;

      const {
        ttl,
        orderHash,
        currencyAddr,
        totalInCrypto,
        payeeAddr,
        shopSignature,
        total,
      } = currentCart;

      (async () => {
        const arg = [
          chainId,
          ttl,
          bytesToHex(orderHash),
          bytesToHex(currencyAddr),
          bytesToHex(totalInCrypto),
          bytesToHex(payeeAddr),
          false,
          shopId,
          bytesToHex(shopSignature),
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
          bytesToHex(currencyAddr),
        );
        setSymbol(symbol);
        const _erc20Amount =
          bytesToNumber(totalInCrypto) / Math.pow(10, decimals);
        setErc20Amount(_erc20Amount);
        if (purchaseAdd) {
          setPurchaseAdd(purchaseAdd as `0x${string}`);
          setSrc(
            `ethereum:${bytesToHex(currencyAddr)}/transfer?address=${purchaseAdd}&uint256=${_erc20Amount}`,
          );
          setCryptoTotal(bytesToNumber(totalInCrypto));
          setTotalDollar(total);
          setStep(2);
        }
      })();
    }
  }, [finalizedOrders, checkoutReqId]);

  const checkout = async () => {
    const isERC20Checkout = false;
    const res = await commitOrder(isERC20Checkout);
    if (res.error) {
      console.log("there was an error");
      setShowErrorMessage(res.error);
    } else if (res.orderFinalizedId) {
      setCheckoutRequestId(res.orderFinalizedId);
    }
  };

  const renderContent = () => {
    console.log({ step, imgSrc, totalDollar, purchaseAddress, cryptoTotal });
    if (step === 0) {
      return <NewCart next={() => setStep(1)} />;
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
      {showErrorMessage && showErrorMessage}
      {/* <ModalHeader /> */}
      {/* <CurrencyButton
        toggle={() => setShowCurrencyOptions(!showCurrencyOptions)}
      /> */}
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
