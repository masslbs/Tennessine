// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useNavigate } from "@tanstack/react-router";
import { getLogger } from "@logtape/logtape";

import { Listing, Order, OrderedItem } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";
import {
  useActiveOrder,
  usePricingCurrency,
  useStateManager,
} from "@massmarket/react-hooks";

import { ListingId, OrderPaymentState } from "../../types.ts";
import ErrorMessage from "../common/ErrorMessage.tsx";
import StockMessage from "../common/StockMessage.tsx";
import { getErrLogger, multiplyAndFormatUnits } from "../../utils/helper.ts";
import PriceSummary from "./PriceSummary.tsx";

const baseLogger = getLogger(["mass-market", "frontend", "Cart"]);

export default function Cart({
  showActionButtons = true,
}: {
  showActionButtons?: boolean;
}) {
  const { activeOrder, cancelAndRecreateOrder } = useActiveOrder();
  const { pricingCurrency } = usePricingCurrency();
  const { stateManager } = useStateManager();
  const navigate = useNavigate();

  const [cartItemsMap, setCartMap] = useState<
    Map<ListingId, Listing>
  >(new Map());
  const [selectedQty, setSelectedQty] = useState<Map<ListingId, number>>(
    new Map(),
  );
  const [inventoryMap, setInventoryMap] = useState<Map<ListingId, number>>(
    new Map(),
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorListing, setErrorListing] = useState<Listing | null>(null);

  const logger = baseLogger.with({
    orderId: activeOrder?.ID,
  });
  const logError = getErrLogger(baseLogger, setErrorMsg);

  function onOrderUpdate(order: CodecValue) {
    const o = Order.fromCBOR(order);
    getAllCartItemDetails(o).then((allCartItems) => {
      if (!allCartItems) return;
      setCartMap(allCartItems);
    });
  }

  useEffect(() => {
    if (!activeOrder || !stateManager) return;
    logger.debug(`Showing cart items for order ID: ${activeOrder.ID}`);
    stateManager.get(["Orders", activeOrder.ID])
      .then(async (res: CodecValue | undefined) => {
        if (!res) {
          logError("No order found");
          return;
        }
        const o = Order.fromCBOR(res);
        const allCartItems = await getAllCartItemDetails(o);
        if (!allCartItems) return;
        setCartMap(allCartItems);
      });

    stateManager.events.on(onOrderUpdate, ["Orders", activeOrder!.ID]);

    return () => {
      stateManager.events.off(onOrderUpdate, ["Orders", activeOrder!.ID]);
    };
  }, [activeOrder, stateManager]);

  useEffect(() => {
    if (!stateManager) return;
    const listingIds = Array.from(inventoryMap.keys());

    // Create a map to store event handlers for each key
    const eventHandlers = new Map();

    listingIds.forEach((key) => {
      const onInventoryUpdate = (stockNo: CodecValue | undefined) => {
        if (typeof stockNo !== "number") logError("Inventory is not a number");
        const updatedInventoryMap = new Map(inventoryMap);
        updatedInventoryMap.set(key, stockNo as number);
        setInventoryMap(updatedInventoryMap);
      };

      // Store the handler reference so we can remove it after
      eventHandlers.set(key, onInventoryUpdate);

      stateManager.events.on(onInventoryUpdate, ["Inventory", key]);
    });

    return () => {
      listingIds.forEach((key) => {
        const handler = eventHandlers.get(key);
        if (!handler) {
          logError(`Handler for ${key} not found`);
          return;
        }
        stateManager.events.off(handler, ["Inventory", key]);
      });
    };
  }, [inventoryMap.keys(), stateManager]);

  if (!activeOrder) {
    return <p>No order</p>;
  }

  async function getAllCartItemDetails(order: Order) {
    if (!stateManager) {
      return;
    }
    const ci = order.Items;
    const allCartItems: Map<ListingId, Listing> = new Map();
    // Get price and metadata for all the selected items in the order.
    const updatedQtyMap = new Map();
    const updatedInventoryMap = new Map();
    await Promise.all(
      ci.map(async (orderItem: OrderedItem) => {
        updatedQtyMap.set(orderItem.ListingID, orderItem.Quantity);
        // If the selected quantity is 0, don't add the item to cart items map
        if (orderItem.Quantity === 0) return;
        const current = await stateManager.get([
          "Listings",
          orderItem.ListingID,
        ]);
        const inventory = await stateManager.get([
          "Inventory",
          orderItem.ListingID,
        ]);
        updatedInventoryMap.set(orderItem.ListingID, inventory);
        if (!current) {
          throw new Error(`Listing ${orderItem.ListingID} not found`);
        }
        const listing = Listing.fromCBOR(current);
        allCartItems.set(orderItem.ListingID, listing);
      }),
    );
    setSelectedQty(updatedQtyMap);
    setInventoryMap(updatedInventoryMap);
    return allCartItems;
  }

  // async function handleCheckout() {
  //   try {
  //     if (!activeOrder) {
  //       logger.debug("orderId not found");
  //       throw new Error("No order found");
  //     }
  //     // Commit the order if it is an open order (not committed)
  //     if (activeOrder!.PaymentState === OrderPaymentState.Open) {
  //       await stateManager!.set(
  //         ["Orders", activeOrder!.ID, "PaymentState"],
  //         OrderPaymentState.Locked,
  //       );
  //       logger.debug(`Order ID: ${activeOrder!.ID} committed`);
  //     }
  //     onCheckout?.();
  //   } catch (error) {
  //     if (
  //       error instanceof RelayResponseError &&
  //       error.cause.code === 9 && error.cause.additionalInfo
  //     ) {
  //       const objectId = error.cause.additionalInfo.objectId;
  //       const l = await stateManager!.get(["Listings", objectId]);
  //       if (!l) throw new Error("Listing not found");
  //       const listing = Listing.fromCBOR(l);
  //       setErrorListing(listing);
  //       setErrorMsg(`Not enough stock for item: ${listing.Metadata.Title}`);
  //     } else {
  //       logError("Error checking out", error);
  //     }
  //   }
  // }

  async function adjustItemQuantity(id: ListingId, add: boolean = true) {
    if (!stateManager) {
      return;
    }
    try {
      let orderId = activeOrder!.ID;
      if (activeOrder!.PaymentState !== OrderPaymentState.Open) {
        orderId = await cancelAndRecreateOrder();
      }
      const updatedQtyMap = new Map(selectedQty);
      updatedQtyMap.set(id, selectedQty.get(id)! + (add ? 1 : -1));
      setSelectedQty(updatedQtyMap);
      const updatedOrderItems = Array.from(cartItemsMap.keys())
        .map((key) => {
          return new OrderedItem(key, updatedQtyMap.get(key)!).asCBORMap();
        }) as CodecValue;
      await stateManager.set(
        ["Orders", orderId, "Items"],
        updatedOrderItems,
      );
      if (id === errorListing?.ID && !add) {
        setErrorListing(null);
        setErrorMsg(null);
      }
    } catch (error) {
      logError("Error adjusting item quantity", error);
    }
  }

  async function removeItem(id: ListingId) {
    if (!stateManager) {
      logger.warn`stateManager is undefined`;
      return;
    }
    try {
      let orderId = activeOrder!.ID;
      if (activeOrder!.PaymentState !== OrderPaymentState.Open) {
        orderId = await cancelAndRecreateOrder();
      }
      const updatedQtyMap = new Map(selectedQty);
      updatedQtyMap.delete(id);
      setSelectedQty(updatedQtyMap);
      const updatedOrderItems: CodecValue[] = Array.from(
        cartItemsMap.keys(),
      )
        .filter((key) => key !== id) // TODO: i _think_ cartItemsMap should be muted already but...
        .map((key) => {
          // TODO: BaseClass.isBaseClass does not recognize BaseClass[] yet
          // so we manually call asCBORMap for now
          return new OrderedItem(key, selectedQty.get(key)!).asCBORMap();
        });
      await stateManager.set(
        ["Orders", orderId, "Items"],
        updatedOrderItems,
      );
      if (id === errorListing?.ID) {
        setErrorListing(null);
        setErrorMsg(null);
      }
    } catch (error) {
      logError("Error removing item", error);
    }
  }

  function calculateTotal() {
    if (!pricingCurrency || cartItemsMap.size === 0) return "0";
    const values: Listing[] = Array.from(cartItemsMap.values());
    let total = BigInt(0);
    values.forEach((item: Listing) => {
      const qty = selectedQty.get(item.ID) || 0;
      // Do not add prices for items that we will remove during commit due to not enough inventory.
      const price = inventoryMap.get(item.ID)! < qty
        ? 0n
        : BigInt(item.Price) * BigInt(qty);
      total += price;
    });
    return formatUnits(total, pricingCurrency.decimals);
  }
  function navigateToListing(itemId: number) {
    navigate({
      to: "/listing-detail",
      search: (prev: Record<string, string>) => ({
        shopId: prev.shopId,
        itemId,
      }),
    });
    // closeCart?.();
  }
  const icon = pricingCurrency?.symbol === "ETH"
    ? "/icons/eth-coin.svg"
    : "/icons/usdc-coin.png";

  function renderItems() {
    if (!activeOrder || !cartItemsMap.size) return <p>No items in cart</p>;

    const values: Listing[] = Array.from(cartItemsMap.values());
    return values.map((item: Listing) => {
      const qty = selectedQty.get(item.ID) || 0;
      // if (!qty) throw new Error(`Quantity for ${item.ID} not found`);
      const price = multiplyAndFormatUnits(
        item.Price,
        qty,
        pricingCurrency?.decimals || 0,
      );
      const inventory = inventoryMap.get(item.ID) || 0;
      let image = "/assets/no-image.png";
      if (item.Metadata.Images && item.Metadata.Images.length > 0) {
        image = item.Metadata.Images[0];
      }
      return (
        <div
          key={item.ID}
          className="flex w-full flex-col"
          data-testid="cart-item"
        >
          <div className="flex">
            <div
              className="flex justify-center h-28 min-w-32"
              data-testid={`product-img`}
            >
              <img
                src={image}
                width={127}
                height={112}
                alt="product-thumb"
                className="w-32 h-28 object-cover object-center rounded-l-lg cursor-pointer"
                onClick={() => {
                  navigateToListing(item.ID);
                }}
              />
            </div>

            <div
              className={`bg-background-gray w-full px-3 py-4 ${
                inventory < 5 ? "rounded-tr-lg" : "rounded-r-lg"
              }`}
            >
              <div className="flex gap-2">
                <h3
                  data-testid="listing-title"
                  className="leading-6 cursor-pointer max-w-[150px] md:max-w-[200px]"
                  onClick={() => {
                    navigateToListing(item.ID);
                  }}
                >
                  {item.Metadata.Title}
                </h3>
                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => removeItem(item.ID)}
                    data-testid={`remove-item-${item.ID}`}
                    className={showActionButtons ? "ml-auto" : "hidden"}
                    style={{
                      backgroundColor: "black",
                      padding: 5,
                      borderRadius: 100,
                    }}
                  >
                    <img
                      src="/icons/remove-icon.svg"
                      alt="remove-icon"
                      width={12}
                      height={12}
                      className="w-[10px] h-[10px]"
                    />
                  </button>
                </div>
              </div>

              <div
                className={`flex gap-2 items-center mt-4 pt-3 border-t border-gray-300 w-full ${
                  (inventory === 0 && showActionButtons)
                    ? "cursor-not-allowed opacity-30"
                    : ""
                }`}
              >
                <div
                  className={showActionButtons
                    ? "flex gap-2 items-center"
                    : "hidden"}
                >
                  <button
                    type="button"
                    onClick={() => adjustItemQuantity(item.ID, false)}
                    data-testid={`remove-quantity-${item.ID}`}
                    className={`${
                      inventory === 0
                        ? "opacity-30 cursor-not-allowed"
                        : "ml-auto"
                    }`}
                    disabled={inventory === 0}
                    style={{ backgroundColor: "transparent", padding: 0 }}
                  >
                    <img
                      src="/icons/minus.svg"
                      alt="minus"
                      width={10}
                      height={10}
                      className="w-5 h-5 max-h-5"
                    />
                  </button>
                  <p data-testid={`quantity-${item.ID}`}>
                    {qty}
                  </p>
                  <button
                    type="button"
                    onClick={() => adjustItemQuantity(item.ID)}
                    data-testid={`add-quantity-${item.ID}`}
                    className={`${
                      qty >= inventory
                        ? "opacity-30 cursor-not-allowed"
                        : "ml-auto"
                    }`}
                    style={{ backgroundColor: "transparent", padding: 0 }}
                    disabled={qty >= inventory}
                  >
                    <img
                      src="/icons/plus.svg"
                      alt="plus"
                      width={10}
                      height={10}
                      className="w-5 h-5 max-h-5"
                    />
                  </button>
                </div>
                <p
                  className={showActionButtons
                    ? "hidden"
                    : "flex gap-2 items-center"}
                  data-testid="selected-qty"
                >
                  Qty: {qty}
                </p>
                <div className="flex gap-1 items-center ml-auto">
                  <img
                    src={icon}
                    alt="coin"
                    width={20}
                    height={20}
                    className="w-5 h-5 max-h-5"
                  />
                  <p
                    data-testid="price"
                    className="text-sm max-w-12 md:max-w-28 truncate"
                  >
                    {price}
                  </p>
                  <p data-testid="symbol" className="text-sm">
                    {pricingCurrency?.symbol}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={showActionButtons ? "" : "hidden"}>
            <StockMessage stock={qty > inventory ? 0 : inventory} />
          </div>
        </div>
      );
    });
  }

  const MAX_TITLE_LEN = 20;
  const oosTitle = (errorListing?.Metadata.Title.length || 0) > MAX_TITLE_LEN
    ? errorListing?.Metadata.Title.slice(0, MAX_TITLE_LEN) + "..."
    : errorListing?.Metadata.Title;
  return (
    <div
      className="bg-white rounded-t-lg p-5 pt-[10px]"
      data-testid="cart-screen"
    >
      <div className="flex flex-col gap-2 mt-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
        {renderItems()}
      </div>
      <div className="mt-4">
        <PriceSummary
          displayedAmount={calculateTotal()}
          tokenIcon={icon}
        />
      </div>

      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
          setErrorListing(null);
        }}
      />
      {errorListing && (
        <p data-testid="out-of-stock" className="my-2 text-red-500">
          Item <span className="font-bold">{oosTitle}</span>{" "}
          is out of stock. Please reduce quantity or remove from cart to
          proceed.
        </p>
      )}
    </div>
  );
}
