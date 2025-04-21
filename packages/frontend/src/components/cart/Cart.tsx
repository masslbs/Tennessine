// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { Link } from "@tanstack/react-router";

import { logger } from "@massmarket/utils";
import { Listing, Order, OrderedItem } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";

import { ListingId, OrderState } from "../../types.ts";
import Button from "../common/Button.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import { useBaseToken } from "../../hooks/useBaseToken.ts";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";
import { multiplyAndFormatUnits } from "../../utils/helper.ts";

const namespace = "frontend:Cart";
const debug = logger(namespace);
const warn = logger(namespace, "warn");
const logerr = logger(namespace, "error");

export default function Cart({
  onCheckout,
  closeBasket,
  showActionButtons = true,
}: {
  onCheckout?: () => Promise<void>;
  closeBasket?: () => void;
  showActionButtons?: boolean;
}) {
  const { currentOrder, cancelOrder, createOrder, cancelAndRecreateOrder } =
    useCurrentOrder();
  const { baseToken } = useBaseToken();
  const { stateManager } = useStateManager();

  const [cartItemsMap, setCartMap] = useState<
    Map<ListingId, Listing>
  >(new Map());
  const [selectedQty, setSelectedQty] = useState<Map<ListingId, number>>(
    new Map(),
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function onOrderUpdate(order: CodecValue) {
    const o = Order.fromCBOR(order);
    getAllCartItemDetails(o).then((allCartItems) => {
      if (!allCartItems) return;
      setCartMap(allCartItems);
    });
  }

  useEffect(() => {
    if (!currentOrder || !stateManager) return;
    debug(`Showing cart items for order ID: ${currentOrder.ID}`);
    stateManager.get(["Orders", currentOrder.ID])
      .then(async (res: CodecValue | undefined) => {
        if (!res) {
          throw new Error("No order found");
        }
        const o = Order.fromCBOR(res);
        const allCartItems = await getAllCartItemDetails(o);
        if (!allCartItems) return;
        setCartMap(allCartItems);
      });

    stateManager.events.on(onOrderUpdate, ["Orders", currentOrder!.ID]);

    return () => {
      stateManager.events.off(onOrderUpdate, ["Orders", currentOrder!.ID]);
    };
  }, [currentOrder, stateManager]);

  if (!currentOrder) {
    return <p>No order</p>;
  }

  async function getAllCartItemDetails(order: Order) {
    if (!stateManager) {
      warn("stateManager is undefined");
      return;
    }
    const ci = order.Items;
    const allCartItems: Map<ListingId, Listing> = new Map();
    // Get price and metadata for all the selected items in the order.
    const updatedQtyMap = new Map();
    await Promise.all(
      ci.map(async (orderItem: OrderedItem) => {
        updatedQtyMap.set(orderItem.ListingID, orderItem.Quantity);
        // If the selected quantity is 0, don't add the item to cart items map
        if (orderItem.Quantity === 0) return;
        const current = await stateManager.get([
          "Listings",
          orderItem.ListingID,
        ]);
        if (!current) {
          throw new Error(`Listing ${orderItem.ListingID} not found`);
        }
        const listing = Listing.fromCBOR(current);
        allCartItems.set(orderItem.ListingID, listing);
      }),
    );
    setSelectedQty(updatedQtyMap);
    return allCartItems;
  }

  async function handleCheckout() {
    try {
      await onCheckout!();
    } catch (error) {
      if (
        error instanceof Error && (
          error.message === "not enough items in stock for order" ||
          error.message == "not enough stock" ||
          error.message == "not in stock"
        )
      ) {
        setErrorMsg("Not enough stock. Cart cleared.");
        await clearCart();
      } else {
        setErrorMsg("Error during checkout");
        logerr("Error during checkout", error);
      }
    }
  }

  async function clearCart() {
    if (!stateManager) {
      warn("stateManager is undefined");
      return;
    }
    try {
      if (currentOrder?.State !== OrderState.Open) {
        await cancelOrder();
        await createOrder();
        return;
      }
      await stateManager.set(
        ["Orders", currentOrder!.ID, "Items"],
        [],
      );
      setCartMap(new Map());
      setSelectedQty(new Map());
      debug("cart cleared");
      closeBasket?.();
    } catch (error) {
      setErrorMsg("Error clearing cart");
      logerr("Error clearing cart", error);
    }
  }

  async function adjustItemQuantity(id: ListingId, add: boolean = true) {
    if (!stateManager) {
      warn("stateManager is undefined");
      return;
    }
    try {
      let orderId = currentOrder!.ID;
      if (currentOrder!.State !== OrderState.Open) {
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
    } catch (error) {
      logerr(`Error:adjustItemQuantity ${error}`);
    }
  }

  async function removeItem(id: ListingId) {
    if (!stateManager) {
      warn("stateManager is undefined");
      return;
    }
    try {
      let orderId = currentOrder!.ID;
      if (currentOrder!.State !== OrderState.Open) {
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
    } catch (error) {
      setErrorMsg("Error removing item");
      logerr(`Error:removeItem ${error}`);
    }
  }

  function calculateTotal() {
    if (!baseToken || cartItemsMap.size === 0) return "0";
    const values: Listing[] = Array.from(cartItemsMap.values());
    let total = BigInt(0);
    values.forEach((item: Listing) => {
      const qty = selectedQty.get(item.ID) || 0;
      // if (!qty) throw new Error(`Quantity for ${item.ID} not found`);
      total += BigInt(item.Price) * BigInt(qty);
    });
    return formatUnits(total, baseToken.decimals);
  }

  const icon = baseToken?.symbol === "ETH"
    ? "/icons/eth-coin.svg"
    : "/icons/usdc-coin.png";

  function renderItems() {
    if (!currentOrder || !cartItemsMap.size) return <p>No items in cart</p>;

    const values: Listing[] = Array.from(cartItemsMap.values());
    return values.map((item: Listing) => {
      const qty = selectedQty.get(item.ID) || 0;
      // if (!qty) throw new Error(`Quantity for ${item.ID} not found`);
      const price = multiplyAndFormatUnits(item.Price, qty, baseToken.decimals);
      let image = "/assets/no-image.png";
      if (item.Metadata.Images && item.Metadata.Images.length > 0) {
        image = item.Metadata.Images[0];
      }
      return (
        <div data-testid="cart-item" key={item.ID}>
          <Link
            to={`/listing-detail`}
            search={(prev: Record<string, string>) => ({
              shopId: prev.shopId,
              itemId: item.ID,
            })}
            style={{ color: "black" }}
          >
            <div
              className="flex"
              onClick={() => {
                closeBasket?.();
              }}
            >
              <div
                className="flex justify-center h-28"
                data-testid={`product-img`}
              >
                <img
                  src={image}
                  width={127}
                  height={112}
                  alt="product-thumb"
                  className="w-32 h-28 object-cover object-center rounded-l-lg"
                />
              </div>
              <div className="bg-background-gray w-full rounded-lg px-3 py-4">
                <div className="flex">
                  <h3 data-testid="title" className="leading-4">
                    {item.Metadata.Title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem(item.ID)}
                    data-testid={`remove-item-${item.ID}`}
                    className={showActionButtons ? "ml-auto" : "hidden"}
                    style={{ backgroundColor: "transparent", padding: 0 }}
                  >
                    <img
                      src="/icons/close-icon.svg"
                      alt="close-icon"
                      width={12}
                      height={12}
                      className="w-3 h-3"
                    />
                  </button>
                </div>

                <div className="flex gap-2 items-center mt-4 pt-3 border-t border-gray-300 w-full">
                  <div
                    className={showActionButtons
                      ? "flex gap-1 items-center"
                      : "hidden"}
                  >
                    <button
                      type="button"
                      onClick={() => adjustItemQuantity(item.ID, false)}
                      data-testid={`remove-quantity-${item.ID}`}
                      className="ml-auto"
                      style={{ backgroundColor: "transparent", padding: 0 }}
                    >
                      <img
                        src="/icons/minus.svg"
                        alt="minus"
                        width={10}
                        height={10}
                        className="w-4 h-4 max-h-4"
                      />
                    </button>
                    <p data-testid={`quantity-${item.ID}`}>
                      {selectedQty.get(item.ID)}
                    </p>
                    <button
                      type="button"
                      onClick={() => adjustItemQuantity(item.ID)}
                      data-testid={`add-quantity-${item.ID}`}
                      className="ml-auto"
                      style={{ backgroundColor: "transparent", padding: 0 }}
                    >
                      <img
                        src="/icons/plus.svg"
                        alt="plus"
                        width={10}
                        height={10}
                        className="w-4 h-4 max-h-4"
                      />
                    </button>
                  </div>
                  <p
                    className={showActionButtons
                      ? "hidden"
                      : "flex gap-2 items-center"}
                  >
                    Qty: {selectedQty.get(item.ID)}
                  </p>

                  <div className="flex gap-2 items-center ml-auto">
                    <img
                      src={icon}
                      alt="coin"
                      width={15}
                      height={15}
                      className="w-4 h-4 max-h-4"
                    />
                    <p data-testid="price" className="text-sm">
                      {price}
                    </p>
                    <p data-testid="symbol" className="text-sm">
                      {baseToken?.symbol}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  }

  return (
    <div className="bg-white rounded-lg p-5">
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      <div className="flex flex-col gap-2">
        {renderItems()}
      </div>
      <div className="mt-4">
        <p>Total Price:</p>
        <div className="flex items-center gap-2">
          <img
            src={icon}
            alt="coin"
            width={20}
            height={20}
            className="w-5 h-5 max-h-5"
          />
          <h1 data-testid="total-price">{calculateTotal()}</h1>
        </div>
      </div>
      <div
        className={showActionButtons ? "flex gap-4 mt-2" : "hidden"}
        id="cart-buttons-container"
      >
        <Button
          disabled={!currentOrder || !cartItemsMap.size || !onCheckout}
          onClick={handleCheckout}
          data-testid="checkout-button"
        >
          <div className="flex items-center gap-2">
            <p>Checkout</p>
            <img
              src="/icons/white-arrow.svg"
              alt="white-arrow"
              width={7}
              height={12}
              style={{
                display: !currentOrder || !cartItemsMap.size || !onCheckout
                  ? "none"
                  : "",
              }}
            />
          </div>
        </Button>
        <button
          type="button"
          disabled={!currentOrder || !cartItemsMap.size}
          onClick={clearCart}
          data-testid="clear-cart"
          style={{ backgroundColor: "transparent", padding: 0 }}
        >
          <p>Clear basket</p>
        </button>
      </div>
    </div>
  );
}
