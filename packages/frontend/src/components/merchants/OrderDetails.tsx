import { useEffect, useState } from "react";
import { createPublicClient, formatUnits, http, toHex } from "viem";
import { type Chain } from "wagmi/chains";
import { useSearch } from "@tanstack/react-router";
import { useChains } from "wagmi";

import {
  AddressDetails,
  Listing,
  Order,
  OrderedItem,
  PaymentDetails,
} from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";

import BackButton from "../common/BackButton.tsx";
import { ListingId, OrderState } from "../../types.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";
import { env } from "../../utils/env.ts";
import { getTokenInformation } from "../../utils/mod.ts";

export default function OrderDetails() {
  const { stateManager } = useStateManager();
  const chains = useChains();
  const search = useSearch({ strict: false });
  const orderId = search.orderId;
  const [cartItemsMap, setCartMap] = useState<Map<ListingId, Listing>>(
    new Map(),
  );
  const [selectedQty, setSelectedQty] = useState<Map<ListingId, number>>(
    new Map(),
  );
  const [txHash, setTxHash] = useState<string | null>(null);
  const [blockHash, setBlockHash] = useState<string | null>(null);
  const [etherScanLink, setLink] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>(new Order());
  const [token, setToken] = useState<{ symbol: string; decimals: number }>({
    symbol: "",
    decimals: 0,
  });
  useEffect(() => {
    if (!orderId) return;
    stateManager.get(["Orders", orderId]).then(
      (res: CodecValue | undefined) => {
        if (!res) throw new Error("Order not found");
        const o = Order.fromCBOR(res as Map<CodecKey, CodecValue>);
        getAllCartItemDetails(o).then((cartItems) => {
          setCartMap(cartItems);
          setOrder(o);
        });
      },
    );
  }, [orderId]);

  useEffect(() => {
    if (order?.State === OrderState.Paid) {
      const id = order.ChosenCurrency!.ChainID;
      order.TxDetails!.TxHash && setTxHash(toHex(order.TxDetails!.TxHash!));
      order.TxDetails!.BlockHash &&
        setBlockHash(toHex(order.TxDetails!.BlockHash!));

      const chain = chains.find((chain: Chain) => chain.id === id) || null;

      if (chain) {
        setLink(chain.blockExplorers?.default?.url || null);
      }
    }
    // TODO: might need to useToken(...)s. one for items, one for order summary
    // this not necessarily the same currency as pricing currency was at the time of order...
    if (order?.ChosenCurrency) {
      const chain = chains.find((chain: Chain) =>
        chain.id === Number(order.ChosenCurrency!.ChainID)
      );
      if (!chain) {
        throw new Error(`Chain (${order.ChosenCurrency!.ChainID}) not found`);
      }
      const tokenPublicClient = createPublicClient({
        chain,
        transport: http(env.ethRPCUrl),
      });
      getTokenInformation(
        tokenPublicClient,
        toHex(order.ChosenCurrency!.Address),
      ).then(([symbol, decimals]) => {
        setToken({ symbol, decimals });
      });
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
      ci.map(async (orderItem: OrderedItem) => {
        const updatedQtyMap = new Map(selectedQty);
        updatedQtyMap.set(orderItem.ListingID, orderItem.Quantity);
        setSelectedQty(updatedQtyMap);
        // If the selected quantity is 0, don't add the item to cart items map
        if (orderItem.Quantity === 0) return;
        // Get price and metadata for all the selected items in the order.
        const listing = await stateManager.get([
          "Listings",
          orderItem.ListingID,
        ]);
        const l = Listing.fromCBOR(listing as Map<CodecKey, CodecValue>);
        allCartItems.set(orderItem.ListingID, l);
      }),
    );
    return allCartItems;
  }

  function renderItems() {
    if (!order || !cartItemsMap.size) return <p>No items in cart</p>;
    const values: Listing[] = Array.from(cartItemsMap.values());
    return values.map((listing: Listing) => {
      return (
        <div key={listing.ID} className="flex gap-4" data-testid="order-item">
          <img
            src={listing.Metadata.Images?.[0] || "/assets/no-image.png"}
            width={48}
            height={48}
            alt="product-thumb"
            className="w-12 h-12 object-cover object-center rounded-lg"
          />
          <h3 data-testid="item-title">{listing.Metadata.Title}</h3>
          <p data-testid="item-quantity">{selectedQty.get(listing.ID)} x</p>
          <p data-testid="item-price">
            {formatUnits(listing.Price, token!.decimals)} {token!.symbol}
          </p>
        </div>
      );
    });
  }

  function renderAddressDetails(addr: AddressDetails, isShipping: boolean) {
    return (
      <section
        className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg"
        data-testid={isShipping ? "shipping-details" : "billing-details"}
      >
        <h2>{isShipping ? "Shipping Details" : "Billing Details"}</h2>
        <div className="flex gap-2">
          <h3>Name</h3>
          <p>{addr.Name}</p>
        </div>
        <div className="flex gap-2">
          <h3>Address</h3>
          <div>
            <p>{addr.Address1}</p>
            {addr.Address2 && <p>{addr.Address2}</p>}
            <p>{addr.City}</p>
            <p>{addr.Country}</p>
            <p>{addr.PostalCode}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <h3>Email</h3>
          <p>{addr.EmailAddress}</p>
        </div>
        {addr.PhoneNumber && (
          <div className="flex gap-2">
            <h3>Phone</h3>
            <p>{addr.PhoneNumber}</p>
          </div>
        )}
      </section>
    );
  }

  function renderPaymentDetails(details: PaymentDetails) {
    if (!details) {
      throw new Error("Payment details not found");
    }
    return (
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h2>Order summary</h2>
        <div className="flex gap-2">
          <p>Total</p>
          <p>{formatUnits(details.Total, token!.decimals)} {token!.symbol}</p>
        </div>
      </section>
    );
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
        <p>Order ID: {order.ID}</p>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h2>Order items</h2>
        {renderItems()}
      </section>
      {order.ShippingAddress
        ? renderAddressDetails(order.ShippingAddress, true)
        : null}
      {order.InvoiceAddress
        ? renderAddressDetails(order.InvoiceAddress, false)
        : null}
      {order.PaymentDetails ? renderPaymentDetails(order.PaymentDetails) : null}
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
