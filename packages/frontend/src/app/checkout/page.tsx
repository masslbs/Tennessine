"use client";
import ProgressBar from "@/app/components/checkout/ProgressBar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import { ItemId } from "@/types";
import { ItemState } from "@/context/types";
import Button from "@/app/common/components/Button";
import QRScan from "@/app/components/transactions/QRScan";
import NewCart from "@/app/cart/NewCart";

const CheckoutFlow = () => {
  const { cartItems, products, cartId, commitCart, finalizedCarts } =
    useStoreContext();
  const [activeCartItems, setActiveCartItems] = useState<ItemState | null>(
    null,
  );
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  const [imgSrc, setSrc] = useState<null | string>(null);
  const [checkoutReqId, setCheckoutRequestId] = useState<`0x${string}` | null>(
    null,
  );
  const [showErrorMessage, setShowErrorMessage] = useState<null | string>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);
  const [erc20Checkout, setErc20Checkout] = useState<boolean>(false);
  const [cryptoTotal, setCryptoTotal] = useState<string | null>(null);
  const [purchaseAdd, setPurchaseAdd] = useState<string | null>(null);
  const [totalDollar, setTotalDollar] = useState<string | null>(null);

  useEffect(() => {
    if (cartId) {
      const items = cartItems.get(cartId)?.items || null;
      setActiveCartItems(items);
    }
  }, [cartId, cartItems]);

  useEffect((): void => {
    if (finalizedCarts && checkoutReqId) {
      const currentCart = finalizedCarts.get(checkoutReqId);
      if (!currentCart) return;
      const { totalInCrypto, erc20Addr, purchaseAddress, total } = currentCart;
      setCryptoTotal(totalInCrypto);
      setPurchaseAdd(purchaseAddress);
      setTotalDollar(total);
      console.log({ totalInCrypto, purchaseAddress });
      if (erc20Checkout) {
        setSrc(
          `ethereum:${erc20Addr}/transfer?address=${purchaseAddress}&uint256=${totalInCrypto}`,
        );
      } else {
        setSrc(`ethereum:${purchaseAddress}?value=${totalInCrypto}`);
      }
      setStep(3);
    }
  }, [finalizedCarts, checkoutReqId]);

  const checkout = async () => {
    const isERC20Checkout = false;
    const res = await commitCart(isERC20Checkout);
    if (res.error) {
      console.log("there was an error");
    } else if (res.cartFinalizedId) {
      setCheckoutRequestId(res.cartFinalizedId);
    }
  };

  const content =
    step == 1 ? (
      <NewCart next={() => setStep(2)} />
    ) : step === 2 ? (
      <div className=" mt-4">
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="price">Name</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-lg"
            id="price"
            name="price"
            onChange={(e) => setName(e.target.value)}
          />
        </form>
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="price">Address</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-lg"
            id="price"
            name="price"
            onChange={(e) => setAddress(e.target.value)}
          />
        </form>
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="price">City</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-lg"
            id="price"
            name="price"
            onChange={(e) => setCity(e.target.value)}
          />
        </form>
        <Button
          onClick={() => {
            checkout();
          }}
        >
          Checkout
        </Button>
      </div>
    ) : (
      <div>
        <QRScan
          imgSrc={imgSrc}
          // totalToRender={header}
          totalDollar={totalDollar}
          purchaseAddress={purchaseAdd}
        />
      </div>
    );
  return (
    <main className="pt-under-nav h-screen bg-gray-100 px-5">
      <ProgressBar currentStep={step} />
      {content}
    </main>
  );
};

export default CheckoutFlow;
