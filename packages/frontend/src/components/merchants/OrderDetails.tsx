import { useEffect, useState } from "react";
import { type Chain, mainnet, optimism, sepolia } from "wagmi/chains";
import { useSearch } from "@tanstack/react-router";

import { Listing, Order, OrderedItem } from "@massmarket/schema";

import BackButton from "../common/BackButton.tsx";
import { ListingId, OrderState } from "../../types.ts";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";

export default function OrderDetails() {
  const { clientStateManager } = useClientWithStateManager();
  const search = useSearch({ strict: false });
  const orderId = search.orderId;
  const [cartItemsMap, setCartMap] = useState<Map<ListingId, Listing>>(
    new Map(),
  );
  const [selectedQty, setSelectedQty] = useState<Map<ListingId, number>>(
    new Map(),
  );
  const [txHash, setTxHash] = useState(null);
  const [blockHash, setBlockHash] = useState(null);
  const [etherScanLink, setLink] = useState<string | null>(null);
  const [date, setDate] = useState("N/A");
  const [order, setOrder] = useState<Order>(new Order());

  useEffect(() => {
    if (!orderId) return;
    clientStateManager!.stateManager.get(["Orders", orderId]).then(
      (res: Map<string, unknown>) => {
        const o = Order.fromCBOR(res);
        getAllCartItemDetails(o).then((cartItems) => {
          setCartMap(cartItems);
        });
        setOrder(o);
      },
    );
  }, [orderId]);

  useEffect(() => {
    if (order?.State === OrderState.Paid) {
      const id = order.ChosenCurrency.ChainID;
      order.TxDetails.TxHash && setTxHash(order.TxDetails.TxHash);
      order.TxDetails.BlockHash && setBlockHash(order.TxDetails.BlockHash);

      let chain: Chain | null = null;
      if (id === optimism.id) {
        chain = optimism;
      } else if (id === sepolia.id) {
        chain = sepolia;
      } else if (id === mainnet.id) {
        chain = mainnet;
      }

      if (chain) {
        setLink(chain.blockExplorers?.default?.url || null);
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
  }, [order]);

  function copyTxHash() {
    navigator.clipboard.writeText(txHash!);
  }

  function copyBlockHash() {
    navigator.clipboard.writeText(blockHash!);
  }

  async function getAllCartItemDetails(order: Order) {
    const ci = order.Items;
    const allCartItems = new Map<ListingId, Listing>();
    await Promise.all(
      ci.map((orderItem: OrderedItem) => {
        const updatedQtyMap = new Map(selectedQty);
        updatedQtyMap.set(orderItem.ListingID, orderItem.Quantity);
        setSelectedQty(updatedQtyMap);
        // If the selected quantity is 0, don't add the item to cart items map
        if (orderItem.Quantity === 0) return;
        // Get price and metadata for all the selected items in the order.
        return clientStateManager!.stateManager.get([
          "Listings",
          orderItem.ListingID,
        ])
          .then((l: Map<string, unknown>) => {
            const listing = Listing.fromCBOR(l);
            allCartItems.set(orderItem.ListingID, listing);
          });
      }),
    );
    return allCartItems;
  }

  function renderItems() {
    if (!order || !cartItemsMap.size) return <p>No items in cart</p>;
    const values: Listing[] = Array.from(cartItemsMap.values());
    return values.map((listing: Listing) => {
      return (
        <div key={listing.id} className="flex gap-4" data-testid="order-item">
          <img
            src={listing.metadata.images[0] || "/assets/no-image.png"}
            width={48}
            height={48}
            alt="product-thumb"
            className="w-12 h-12 object-cover object-center rounded-lg"
          />
          <h3 data-testid="item-title">{listing.metadata.title}</h3>
        </div>
      );
    });
  }
  if (!order) return <p data-testid="order-details-page">No order found</p>;
  return (
    <main
      className="p-4 pt-under-nav"
      data-testid="order-details-page"
    >
      <BackButton href="/orders" />
      <div className="mt-5">
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
          <section
            className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg"
            data-testid="shipping-details"
          >
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
        <div className={txHash ? "" : "hidden"}>
          <h2>Tx Hash</h2>
          <div className="flex gap-2">
            <div
              className={`bg-background-gray p-2 rounded-md overflow-x-auto w-40 
            }`}
            >
              <p>{txHash}</p>
            </div>
            <button
              onClick={copyTxHash}
              style={{ backgroundColor: "transparent", padding: 0 }}
              type="button"
            >
              <img
                src="/icons/copy-icon.svg"
                width={20}
                height={20}
                alt="copy-icon"
                className="w-auto h-auto ml-auto"
              />
            </button>
          </div>
        </div>
        <div className={blockHash ? "" : "hidden"}>
          <h2>Block Hash</h2>
          <div className="flex gap-2">
            <div
              className={`bg-background-gray p-2 rounded-md overflow-x-auto w-40 ${
                blockHash ? "" : "hidden"
              }`}
            >
              <p>{blockHash}</p>
            </div>
            <button
              onClick={copyBlockHash}
              style={{ backgroundColor: "transparent", padding: 0 }}
              type="button"
            >
              <img
                src="/icons/copy-icon.svg"
                width={20}
                height={20}
                alt="copy-icon"
                className="w-auto h-auto ml-auto"
              />
            </button>
          </div>
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
