// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useState } from "react";
import { formatUnits } from "viem";

import { assert, logger } from "@massmarket/utils";
import { Listing, Order, OrderedItem } from "@massmarket/schema";

import { ListingId, OrderId } from "../../types.ts";
import Button from "../common/Button.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import { useBaseToken } from "../../hooks/useBaseToken.ts";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";
import { multiplyAndFormatUnits } from "../../utils/helper.ts";

const namespace = "frontend:Cart";
const debug = logger(namespace);
const logerr = logger(namespace, "error");

export default function Cart({
  onCheckout,
  closeBasket,
  showActionButtons = true,
}: {
  onCheckout?: (orderId: OrderId) => Promise<void>;
  closeBasket?: () => void;
  showActionButtons?: boolean;
}) {
  const { currentOrder } = useCurrentOrder();
  const { baseToken } = useBaseToken();
  const { clientStateManager } = useClientWithStateManager();

  const [cartItemsMap, setCartMap] = useState<
    Map<ListingId, Listing>
  >(new Map());
  const [selectedQty, setSelectedQty] = useState<Map<ListingId, number>>(
    new Map(),
  );
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sm = clientStateManager?.stateManager;

  useEffect(() => {
    if (!sm) return;
    function onOrderUpdate(order: Map<string, unknown>) {
      const o = new Order(order);
      getAllCartItemDetails(o).then((allCartItems) => {
        setCartMap(allCartItems);
      });
    }

    sm.get(["Orders", currentOrder!.ID]).then(
      (order: Map<string, unknown>) => {
        getAllCartItemDetails(new Order(order)).then((allCartItems) => {
          setCartMap(allCartItems);
        });
      },
    );

    sm.events.on(onOrderUpdate, ["Orders", currentOrder!.ID]);

    return () => {
      sm.events.off(onOrderUpdate, ["Orders", currentOrder!.ID]);
    };
  }, [sm]);

  useEffect(() => {
    if (!currentOrder || !sm) return;
    debug(`Showing cart items for order ID: ${currentOrder.ID}`);
    setOrderId(currentOrder.ID);
    sm.get(["Orders", currentOrder.ID])
      .then(async (res) => {
        const o = new Order(res);
        const allCartItems = await getAllCartItemDetails(o);
        setCartMap(allCartItems);
      });
  }, [currentOrder, sm]);

  async function getAllCartItemDetails(order: Order) {
    const ci = order.Items;
    const allCartItems: Map<ListingId, Listing> = new Map();
    // Get price and metadata for all the selected items in the order.
    await Promise.all(
      ci.map((orderItem: OrderedItem) => {
        const updatedQtyMap = new Map(selectedQty);
        updatedQtyMap.set(orderItem.ListingID, orderItem.Quantity);
        setSelectedQty(updatedQtyMap);
        // If the selected quantity is 0, don't add the item to cart items map
        if (orderItem.Quantity === 0) return;
        return sm.get([
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

  async function handleCheckout(orderId: OrderId) {
    try {
      await onCheckout!(orderId);
    } catch (error) {
      assert(error instanceof Error, "Error is not an instance of Error");
      if (
        error.message === "not enough items in stock for order" ||
        error.message == "not enough stock" ||
        error.message == "not in stock"
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
    try {
      await sm.set(
        ["Orders", orderId, "Items"],
        [],
      );
      setCartMap(new Map());
      setSelectedQty(new Map());
      debug("cart cleared");
      closeBasket?.();
    } catch (error) {
      assert(error instanceof Error, "Error is not an instance of Error");
      setErrorMsg("Error clearing cart");
      logerr("Error clearing cart", error);
    }
  }

  async function adjustItemQuantity(id: ListingId, add: boolean = true) {
    try {
      const updatedQtyMap = new Map(selectedQty);
      updatedQtyMap.set(id, selectedQty.get(id)! + (add ? 1 : -1));
      setSelectedQty(updatedQtyMap);
      const updatedOrderItems: OrderedItem[] = Array.from(cartItemsMap.keys())
        .map((key) => {
          return {
            ListingID: key,
            Quantity: selectedQty.get(key)!,
          };
        });
      await sm.set(
        ["Orders", orderId, "Items"],
        updatedOrderItems,
      );
    } catch (error) {
      logerr(`Error:addQuantity ${error}`);
    }
  }

  async function removeItem(id: ListingId) {
    try {
      const updatedQtyMap = new Map(selectedQty);
      updatedQtyMap.delete(id);
      setSelectedQty(updatedQtyMap);
      const updatedOrderItems: OrderedItem[] = Array.from(cartItemsMap.keys())
        .map((key) => {
          return {
            ListingID: key,
            Quantity: selectedQty.get(key)!,
          };
        });
      await sm.set(
        ["Orders", orderId, "Items"],
        updatedOrderItems,
      );
    } catch (error) {
      logerr(`Error:removeItem ${error}`);
    }
  }

  function calculateTotal() {
    if (!baseToken || cartItemsMap.size === 0) return "0";
    const values: Listing[] = Array.from(cartItemsMap.values());
    let total = BigInt(0);
    values.forEach((item: Listing) => {
      total += baseToken?.decimals
        ? BigInt(item.Price) * BigInt(selectedQty.get(item.ID)!)
        : BigInt(0);
    });
    return formatUnits(total, baseToken.decimals);
  }

  const icon = baseToken?.symbol === "ETH"
    ? "/icons/eth-coin.svg"
    : "/icons/usdc-coin.png";

  function renderItems() {
    if (!orderId || !cartItemsMap.size) return <p>No items in cart</p>;

    const values: Listing[] = Array.from(cartItemsMap.values());
    return values.map((item: Listing) => {
      const price = baseToken?.decimals
        ? multiplyAndFormatUnits(
          item.Price,
          selectedQty.get(item.ID) || 0,
          baseToken.decimals,
        )
        : 0;

      return (
        <div key={item.ID} className="flex" data-testid="cart-item">
          <div className="flex justify-center h-28" data-testid={`product-img`}>
            <img
              src={item.Metadata.Images[0] || "/assets/no-image.png"}
              width={127}
              height={112}
              alt="product-thumb"
              className="w-32 h-28 object-cover object-center rounded-l-lg"
            />
          </div>
          <div className="bg-background-gray w-full rounded-lg px-5 py-4">
            <div className="flex">
              <h3 data-testid="title" className="leading-4">
                {item.Metadata.Title}
              </h3>
              <button
                type="button"
                onClick={() => removeItem(item.ID)}
                data-testid={`remove-item-${item.id}`}
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
                  ? "flex gap-2 items-center"
                  : "hidden"}
              >
                <button
                  type="button"
                  onClick={() => adjustItemQuantity(item.id, false)}
                  data-testid={`remove-quantity-${item.ID}`}
                  className="ml-auto"
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
                    className="w-5 h-5 max-h-5"
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
                  width={20}
                  height={20}
                  className="w-5 h-5 max-h-5"
                />
                <p data-testid="price">{price}</p>
                <p data-testid="symbol">{baseToken?.symbol}</p>
              </div>
            </div>
          </div>
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
          disabled={!orderId || !cartItemsMap.size || !onCheckout}
          onClick={() => handleCheckout(orderId!)}
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
                display: !orderId || !cartItemsMap.size || !onCheckout
                  ? "none"
                  : "",
              }}
            />
          </div>
        </Button>
        <button
          type="button"
          disabled={!orderId || !cartItemsMap.size}
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
