"use client";

import React, { useEffect, useState } from "react";
import { mainnet, optimism, sepolia } from "wagmi/chains";

import BackButton from "@/app/common/components/BackButton";
import { useUserContext } from "@/context/UserContext";
import { ListingId, Order } from "@/types";

export default function OrderDetails({ order, onBack }) {
  const { clientWithStateManager } = useUserContext();

  const [allOrderItems, setAllItems] = useState(new Map());
  const [transactionHash, setHash] = useState(null);
  const [etherScanLink, setLink] = useState("");

  useEffect(() => {
    if (order.choosePayment) {
      const id = order.choosePayment.currency.chainId;
      const hash = order.txHash || order.blockHash;
      setHash(hash);
      //FIXME: clean this up to dynamically attach chain name.
      if (id === optimism.id) {
        setLink(`https://optimism.etherscan.io/tx/${order.hash}`);
      } else if (id === sepolia.id) {
        setLink(`https://sepolia.etherscan.io/tx/${order.hash}`);
      } else if (id === mainnet.id) {
        setLink(`https://etherscan.io/tx/${order.hash}`);
      }
    }
    getCartItemDetails(order).then((allItems) => {
      setAllItems(allItems);
    });
  }, [order]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionHash);
  };

  async function getCartItemDetails(order: Order) {
    const ci = order.items;
    const cartObjects = new Map();
    // Get price and metadata for all the selected items in the order.
    const itemIds = Object.keys(ci);
    await Promise.all(
      itemIds.map(async (id) => {
        const item = await clientWithStateManager.stateManager.listings.get(
          id as ListingId,
        );
        cartObjects.set(id, {
          ...item,
          selectedQty: ci[id as ListingId],
        });
      }),
    );
    return cartObjects;
  }
  function renderItems() {
    if (!order || !allOrderItems.size) return <p>No items in cart</p>;
    const values = allOrderItems.values();
    return Array.from(values).map((item) => {
      return (
        <div key={order.id} className="flex gap-4">
          <img
            src={item.metadata.images[0] || "/assets/no-image.png"}
            width={48}
            height={48}
            alt="product-thumb"
            className="w-12 h-12 object-cover object-center rounded-lg"
          />
          <h3>{item.metadata.title}</h3>
        </div>
      );
    });
  }
  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <BackButton onClick={onBack} />
      <div>
        <h1>Order overview</h1>
      </div>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <p>Order ID: {order.id}</p>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h2>Order items</h2>
        {renderItems()}
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h2>Shipping Details</h2>
        <div className="flex gap-2">
          <h3>Name</h3>
          <p>{order.shippingDetails.name}</p>
        </div>
        <div className="flex gap-2">
          <h3>Address</h3>
          <div>
            <p>{order.shippingDetails.address1}</p>
            <p>{order.shippingDetails.city}</p>
            <p>{order.shippingDetails.country}</p>
            <p>{order.shippingDetails.postalCode}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <h3>Email</h3>
          <p>{order.shippingDetails.emailAddress}</p>
        </div>
        <div className="flex gap-2">
          <h3>Phone</h3>
          <p>{order.shippingDetails.phoneNumber}</p>
        </div>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h2>Transaction Hash</h2>
        <div className="flex gap-2">
          <div
            className={`bg-background-gray p-2 rounded-md overflow-x-auto w-40 ${
              transactionHash ? "" : "hiden"
            }`}
          >
            <p>{transactionHash}</p>
          </div>
          <button onClick={copyToClipboard}>
            <img
              src="/icons/copy-icon.svg"
              width={20}
              height={20}
              alt="copy-icon"
              className="w-auto h-auto ml-auto"
            />
          </button>
        </div>
        <a href={etherScanLink} className={etherScanLink ? "" : "hidden"}>
          View transaction
        </a>
      </section>
    </main>
  );
}
