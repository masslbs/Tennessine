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
} from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";
import { logger } from "@massmarket/utils";

import BackButton from "../common/BackButton.tsx";
import { ListingId, OrderState } from "../../types.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";
import { useBaseToken } from "../../hooks/useBaseToken.ts";
import { env } from "../../utils/env.ts";
import { formatDate, getTokenInformation } from "../../utils/mod.ts";

const warn = logger("OrderDetails", "warn");

export default function OrderDetails() {
  const { stateManager } = useStateManager();
  const chains = useChains();
  const search = useSearch({ strict: false });
  const { baseToken } = useBaseToken();
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
  const [token, setToken] = useState<
    { symbol: string; decimals: number }
  >({
    symbol: "",
    decimals: 0,
  });
  const [orderDate, setOrderDate] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !stateManager) return;
    stateManager.get(["Orders", orderId]).then(
      (res: CodecValue | undefined) => {
        if (!res) throw new Error("Order not found");
        const o = Order.fromCBOR(res);
        getAllCartItemDetails(o).then((cartItems) => {
          setCartMap(cartItems);
          setOrder(o);

          if (o.PaymentDetails) {
            const d = formatDate(o.PaymentDetails!.TTL);
            setOrderDate(d);
          }
        });
      },
    );
  }, [orderId, stateManager]);

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
    // Show price in pricing currency as default.
    setToken(baseToken);
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
    if (!stateManager) {
      warn("stateManager is undefined");
      return new Map();
    }
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
        if (!listing) throw new Error("Listing not found");
        const l = Listing.fromCBOR(listing);
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
          <h3 data-testid="item-title" className="line-clamp-2">
            {listing.Metadata.Title}
          </h3>
          <p data-testid="item-quantity">{selectedQty.get(listing.ID)}</p>
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

  if (!order) return <p data-testid="order-details-page">No order found</p>;

  return (
    <main
      className="px-4 md:flex justify-center"
      data-testid="order-details-page"
    >
      <section className="md:w-[560px]">
        <BackButton href="/orders" />
        <div className="my-5">
          <h1>Order overview</h1>
        </div>
        <section className="flex justify-between grid grid-cols-2 gap-1">
          <div className="bg-white p-2 rounded-lg flex">
            <p className="mr-2">Order ID:</p>
            <p className="font-bold">{order.ID}</p>
          </div>
          <div className="bg-white p-2 rounded-lg flex">
            <p className="mr-2">
              Total:
            </p>
            <p className="font-bold">
              {order.PaymentDetails
                ? `${
                  formatUnits(
                    BigInt(order.PaymentDetails!.Total),
                    token!.decimals,
                  )
                } ${token!.symbol}`
                : "N/A"}
            </p>
          </div>
          <div className="bg-white p-2 rounded-lg flex">
            <p className="mr-2">Order Date:</p>
            <p className="font-bold">{orderDate}</p>
          </div>
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

        <section
          className={`mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg ${
            txHash || blockHash ? "" : "hidden"
          }`}
        >
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
      </section>
    </main>
  );
}
