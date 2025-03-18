// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useState } from "react";
import { formatUnits } from "viem";

import { assert, logger } from "@massmarket/utils";

import {
  CartItem,
  ListingId,
  OrderEventTypes,
  OrderId,
  TListing,
  TOrder,
} from "../../types.ts";

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
    Map<ListingId, CartItem>
  >(new Map());
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!clientStateManager) return;
    function onChangeItems(res: [OrderEventTypes, TOrder]) {
      if (res[0] === OrderEventTypes.CHANGE_ITEMS) {
        getCartItemDetails(res[1]).then((itemDetails) => {
          setCartMap(itemDetails);
        });
      }
    }

    clientStateManager.stateManager.orders.on("update", onChangeItems);
    return () => {
      clientStateManager.stateManager.orders.removeListener(
        "update",
        onChangeItems,
      );
    };
  }, [clientStateManager]);

  useEffect(() => {
    if (currentOrder) {
      debug(`Showing cart items for order ID: ${currentOrder.orderId}`);
      setOrderId(currentOrder.orderId);
      clientStateManager!
        .stateManager!.orders.get(currentOrder.orderId)
        .then(async (o: TOrder) => {
          const itemDetails = await getCartItemDetails(o);
          setCartMap(itemDetails);
        });
    }
  }, [currentOrder]);

  async function getCartItemDetails(order: TOrder) {
    const ci = order.items;
    const cartObjects = new Map();
    // Get price and metadata for all the selected items in the order.
    const itemIds = Object.keys(ci);
    await Promise.all(
      itemIds.map((id) => {
        // If the selected quantity is 0, don't add the item to the cart object..
        const selectedQty = ci[id as ListingId];
        if (selectedQty === 0) return;
        return clientStateManager!.stateManager.get(["Listings", id])
          .then((item: TListing) => {
            cartObjects.set(id, {
              ...item,
              selectedQty,
            });
          });
      }),
    );
    return cartObjects;
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
      const values: CartItem[] = Array.from(
        cartItemsMap.values(),
      );
      const map = values.map((item) => {
        // We are getting the quantity to remove from the order for every item in the cart.
        return {
          listingId: item.id,
          quantity: item.selectedQty,
        };
      });
      await clientStateManager!.stateManager.orders.removeItems(
        orderId!,
        map,
      );
      setCartMap(new Map());
      debug("cart cleared");
      closeBasket?.();
    } catch (error) {
      assert(error instanceof Error, "Error is not an instance of Error");
      setErrorMsg("Error clearing cart");
      logerr("Error clearing cart", error);
    }
  }

  async function addQuantity(id: ListingId) {
    try {
      await clientStateManager!.stateManager.orders.addItems(orderId!, [
        {
          listingId: id,
          quantity: 1,
        },
      ]);
    } catch (error) {
      logerr(`Error:addQuantity ${error}`);
    }
  }

  async function removeQuantity(id: ListingId) {
    try {
      await clientStateManager!.stateManager.orders.removeItems(orderId!, [
        {
          listingId: id,
          quantity: 1,
        },
      ]);
    } catch (error) {
      logerr(`Error:removeQuantity ${error}`);
    }
  }

  async function removeItem(id: ListingId, selectedQty: number) {
    try {
      await clientStateManager!.stateManager.orders.removeItems(orderId!, [
        {
          listingId: id,
          quantity: selectedQty,
        },
      ]);
    } catch (error) {
      logerr(`Error:removeItem ${error}`);
    }
  }
  function calculateTotal() {
    if (!baseToken) return "0";
    const values: CartItem[] = Array.from(cartItemsMap.values());
    let total = BigInt(0);
    values.forEach((item) => {
      total += baseToken?.decimals
        ? BigInt(item.price) * BigInt(item.selectedQty)
        : BigInt(0);
    });
    return formatUnits(total, baseToken.decimals);
  }
  const icon = baseToken?.symbol === "ETH"
    ? "/icons/eth-coin.svg"
    : "/icons/usdc-coin.png";

  function renderItems() {
    if (!orderId || !cartItemsMap.size) return <p>No items in cart</p>;

    const values: CartItem[] = Array.from(cartItemsMap.values());
    return values.map((item) => {
      const price = baseToken?.decimals
        ? multiplyAndFormatUnits(
          item.price,
          item.selectedQty,
          baseToken.decimals,
        )
        : 0;

      return (
        <div key={item.id} className="flex" data-testid="cart-item">
          <div className="flex justify-center h-28" data-testid={`product-img`}>
            <img
              src={item.metadata.images[0] || "/assets/no-image.png"}
              width={127}
              height={112}
              alt="product-thumb"
              className="w-32 h-28 object-cover object-center rounded-l-lg"
            />
          </div>
          <div className="bg-background-gray w-full rounded-lg px-5 py-4">
            <div className="flex">
              <h3 data-testid="title" className="leading-4">
                {item.metadata.title}
              </h3>
              <button
                type="button"
                onClick={() => removeItem(item.id, item.selectedQty)}
                data-testid={`remove-item-${item.id}`}
                className={showActionButtons
                  ? "ml-auto bg-transparent p-0"
                  : "hidden"}
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
                  onClick={() => removeQuantity(item.id)}
                  data-testid={`remove-quantity-${item.id}`}
                  className="ml-auto bg-transparent p-0"
                >
                  <img
                    src="/icons/minus.svg"
                    alt="minus"
                    width={10}
                    height={10}
                    className="w-5 h-5 max-h-5"
                  />
                </button>
                <p data-testid={`quantity-${item.id}`}>{item.selectedQty}</p>
                <button
                  type="button"
                  onClick={() => addQuantity(item.id)}
                  data-testid={`add-quantity-${item.id}`}
                  className="ml-auto bg-transparent p-0"
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
                Qty: {item.selectedQty}
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
          className="bg-transparent text-black"
        >
          <p>Clear basket</p>
        </button>
      </div>
    </div>
  );
}
