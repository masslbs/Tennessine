import { useEffect, useState } from "react";
import { createPublicClient, formatUnits, http, toHex } from "viem";
import { type Chain } from "wagmi/chains";
import { useSearch } from "@tanstack/react-router";
import { useChains } from "wagmi";
import { getLogger } from "@logtape/logtape";
import {
  AddressDetails,
  Listing,
  Order,
  OrderedItem,
} from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";
import { getTokenInformation } from "@massmarket/contracts";
import { usePricingCurrency, useStateManager } from "@massmarket/react-hooks";

import BackButton from "../common/BackButton.tsx";
import { ListingId, OrderPaymentState } from "../../types.ts";
import { formatDate, OrderPaymentStateFromNumber } from "../../utils/mod.ts";

const baseLogger = getLogger(["mass-market", "frontend", "OrderDetails"]);

export default function OrderDetails() {
  const { stateManager } = useStateManager();
  const chains = useChains();
  const search = useSearch({ strict: false });
  const { pricingCurrency } = usePricingCurrency();
  const orderId = search.orderId;
  const [cartItemsMap, setCartMap] = useState<
    Map<ListingId, { selectedQty: number; listing: Listing }>
  >(
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

  const logger = baseLogger.with({
    orderId: orderId,
  });

  useEffect(() => {
    if (!orderId || !stateManager) return;

    function onOrderUpdate(res: CodecValue | undefined) {
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
    }
    stateManager.get(["Orders", orderId]).then(
      (res: CodecValue | undefined) => {
        if (!res) {
          logger.debug("Order not found");
          return;
        }
        onOrderUpdate(res);
      },
    );

    stateManager.events.on(onOrderUpdate, ["Orders", orderId]);

    return () => {
      stateManager.events.off(onOrderUpdate, ["Orders", orderId]);
    };
  }, [orderId, stateManager]);

  useEffect(() => {
    if (order?.PaymentState === OrderPaymentState.Paid) {
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
    pricingCurrency && setToken(pricingCurrency);
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
        transport: http(),
      });
      getTokenInformation(
        tokenPublicClient,
        toHex(order.ChosenCurrency!.Address),
      ).then(({ symbol, decimal }) => {
        setToken({ symbol, decimals: decimal });
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
      logger.warn("stateManager is undefined");
      return new Map();
    }
    const ci = order.Items;
    const allCartItems = new Map<
      ListingId,
      { selectedQty: number; listing: Listing }
    >();
    await Promise.all(
      ci.map(async (orderItem: OrderedItem) => {
        // If the selected quantity is 0, don't add the item to cart items map
        if (orderItem.Quantity === 0) return;
        // Get price and metadata for all the selected items in the order.
        const listing = await stateManager.get([
          "Listings",
          orderItem.ListingID,
        ]);
        if (!listing) throw new Error("Listing not found");
        const l = Listing.fromCBOR(listing);
        allCartItems.set(orderItem.ListingID, {
          selectedQty: orderItem.Quantity,
          listing: l,
        });
      }),
    );
    return allCartItems;
  }

  function renderItems() {
    if (!order || !cartItemsMap.size) return <p>No items in cart</p>;
    return Array.from(cartItemsMap.values()).map(
      ({ selectedQty, listing }: { selectedQty: number; listing: Listing }) => {
        return (
          <div
            key={listing.ID}
            className="flex gap-4 md:grid md:grid-cols-3 items-center"
            data-testid="order-item"
          >
            <div className="flex gap-1 items-center">
              <img
                src={listing.Metadata.Images?.[0] || "/assets/no-image.png"}
                width={48}
                height={48}
                alt="product-thumb"
                className="w-12 h-12 object-cover object-center rounded-lg"
              />
              <p
                data-testid="item-title"
                className="line-clamp-2 font-bold text-base text-sm/6 max-w-28"
              >
                {listing.Metadata.Title}
              </p>
            </div>
            <p data-testid="item-quantity" className="ml-auto">
              Quantity: {selectedQty}
            </p>
          </div>
        );
      },
    );
  }

  function renderAddressDetails(addr: AddressDetails, isShipping: boolean) {
    return (
      <section
        className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg"
        data-testid={isShipping ? "shipping-details" : "billing-details"}
      >
        <h2>{isShipping ? "Shipping Details" : "Billing Details"}</h2>
        <div className="grid grid-cols-2">
          <h3>Name</h3>
          <p className="font-light">{addr.Name}</p>
        </div>
        <div className="grid grid-cols-2">
          <h3>Address</h3>
          <div>
            <p className="font-light">{addr.Address1}</p>
            {addr.Address2 && <p className="font-light">{addr.Address2}</p>}
            <p className="font-light">{addr.City}</p>
            <p className="font-light">{addr.Country}</p>
            <p className="font-light">{addr.PostalCode}</p>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <h3>Email</h3>
          <p className="font-light">{addr.EmailAddress}</p>
        </div>
        <div className="grid grid-cols-2">
          <h3>Phone</h3>
          <p className="font-light">{addr.PhoneNumber ?? "N/A"}</p>
        </div>
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
        <BackButton />
        <div className="my-1">
          <h1>Order overview</h1>
        </div>
        <section>
          <div className="bg-white p-2 rounded-lg flex whitespace-nowrap">
            <p className="mr-2">Order no:</p>
            <p className="font-bold">{order.ID}</p>
          </div>
          <div className="flex justify-between grid grid-cols-2 gap-1 mt-1">
            <div className="bg-white p-2 rounded-lg flex">
              <p className="mr-2">
                Total Price:
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
            <div className="bg-white p-2 rounded-lg flex whitespace-nowrap">
              <p className="mr-2">Status:</p>
              <p className="font-bold">
                {OrderPaymentStateFromNumber(order.PaymentState)}
              </p>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg flex mt-1">
            <p className="mr-2">Date:</p>
            <p className="font-bold">{orderDate}</p>
          </div>
        </section>

        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
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
          <h2>Transaction Hash</h2>
          <div className={txHash ? "" : "hidden"}>
            <h4>Tx Hash</h4>
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
            <h4>Block Hash</h4>
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
