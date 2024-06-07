"use client";
import ProgressBar from "@/app/components/checkout/ProgressBar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import { ItemId } from "@/types";
import { ItemState } from "@/context/types";
import Button from "@/app/common/components/Button";
import QRScan from "@/app/components/transactions/QRScan";

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
  const noItems =
    !cartId || !activeCartItems || !Object.keys(activeCartItems).length;

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

  const renderItems = () => {
    if (noItems) return <p className="text-center">you have no items</p>;

    return Object.keys(activeCartItems).map((id) => {
      const itemId = id as ItemId;
      const item = products.get(itemId);
      if (!item || !item.metadata.image) return;

      return (
        <div key={item.metadata.title} className="flex my-4">
          <div className="flex justify-center mr-3">
            <input type="checkbox" checked />
          </div>
          <Image
            src={item.metadata.image}
            width={58}
            height={58}
            alt="item-thumbnail"
            unoptimized={true}
          />
          <div className="flex flex-col ml-4 mr-auto">
            <p>{item.metadata.title}</p>
            <p className="text-xs">{item.metadata.description}</p>
          </div>
        </div>
      );
    });
  };

  const content =
    step == 1 ? (
      <div>
        <h2 className="text-center my-4">80ETH</h2>
        <Button onClick={() => setStep(2)}>Proceed</Button>
        <section className="mt-10">
          <p>Deselect all items</p>
          {renderItems()}
        </section>
      </div>
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
