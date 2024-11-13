"use client";

import React, { useEffect, useState } from "react";
import { mainnet, optimism, sepolia } from "wagmi/chains";

import BackButton from "@/app/common/components/BackButton";
import { useUserContext } from "@/context/UserContext";
import { ListingId, Order, OrderState } from "@/types";

export default function OrderDetails({ order, onBack }) {
  const { clientWithStateManager } = useUserContext();

  const [allOrderItems, setAllItems] = useState(new Map());
  const [txHash, setTxHash] = useState(null);
  const [blockHash, setBlockHash] = useState(null);
  const [etherScanLink, setLink] = useState("");
  const [date, setDate] = useState("N/A");

  useEffect(() => {
    if (order.status === OrderState.STATE_PAYMENT_TX) {
      const id = order.choosePayment.currency.chainId;
      order.txHash && setTxHash(order.txHash);
      order.blockHash && setBlockHash(order.blockHash);

      //FIXME: clean this up to dynamically attach chain name.
      if (id === optimism.id) {
        setLink(`https://optimism.etherscan.io`);
      } else if (id === sepolia.id) {
        setLink(`https://sepolia.etherscan.io`);
      } else if (id === mainnet.id) {
        setLink(`https://etherscan.io`);
      }
      if (order.timestamp) {
        const d = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(order.timestamp * 1000);
        setDate(d);
      }
    }

    getCartItemDetails(order).then((allItems) => {
      setAllItems(allItems);
    });
  }, [order]);

  function copyTxHash() {
    navigator.clipboard.writeText(txHash);
  }

  function copyBlockHash() {
    navigator.clipboard.writeText(blockHash);
  }

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
        <p>Last updated: {date}</p>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h2>Order items</h2>
        {renderItems()}
      </section>
      {order.shippingDetails
        ? (
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
        )
        : null}
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h2>Tx Hash</h2>
        <div className="flex gap-2">
          <div
            className={`bg-background-gray p-2 rounded-md overflow-x-auto w-40 ${
              txHash ? "" : "hiden"
            }`}
          >
            <p>{txHash}</p>
          </div>
          <button onClick={copyTxHash}>
            <img
              src="/icons/copy-icon.svg"
              width={20}
              height={20}
              alt="copy-icon"
              className="w-auto h-auto ml-auto"
            />
          </button>
        </div>
        <h2>Block Hash</h2>
        <div className="flex gap-2">
          <div
            className={`bg-background-gray p-2 rounded-md overflow-x-auto w-40 ${
              blockHash ? "" : "hiden"
            }`}
          >
            <p>{blockHash}</p>
          </div>
          <button onClick={copyBlockHash}>
            <img
              src="/icons/copy-icon.svg"
              width={20}
              height={20}
              alt="copy-icon"
              className="w-auto h-auto ml-auto"
            />
          </button>
        </div>
        <a
          href={`${etherScanLink}/tx/${txHash}`}
          className={etherScanLink && txHash ? "" : "hidden"}
        >
          View TX
        </a>
        <a
          href={`${etherScanLink}/block/${blockHash}`}
          className={etherScanLink && blockHash ? "" : "hidden"}
        >
          View block
        </a>
      </section>
    </main>
  );
}
