// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { privateKeyToAccount } from "viem/accounts";
import * as Sentry from "@sentry/nextjs";
import { formatUnitsFromString, logger } from "@massmarket/utils";
import { createQueryString } from "@/app/utils";
import Button from "@/app/common/components/Button";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import BackButton from "@/app/common/components/BackButton";
import { Listing, ListingId, OrderId, Tag, Order, OrderState } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import SuccessToast from "@/app/common/components/SuccessToast";

const namespace = "frontend:product-detail";
const debug = logger(namespace);
const log = logger(namespace, "info");

const ProductDetail = () => {
  const { getBaseTokenInfo } = useStoreContext();
  const { upgradeGuestToCustomer, clientWithStateManager } = useUserContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMerchantView } = useAuth();
  const itemId = searchParams.get("itemId") as ListingId;

  const [quantity, setQuantity] = useState<number>(0);
  const [item, setItem] = useState<Listing | null>(null);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [allTags, setAllTags] = useState(new Map());
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [price, setPrice] = useState("");
  const [buttonState, setButton] = useState<"Success" | "Review" | "Update">(
    "Review",
  );
  const [currentCartItems, setCurrentCart] = useState<Order["items"] | null>(
    null,
  );
  const [successMsg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    clientWithStateManager!
      .stateManager!.orders.getStatus(OrderState.STATE_OPEN)
      .then((res) => {
        if (res.length > 1) {
          warn("Multiple open orders found");
        } else if (!res.length) {
          warn("No open order found");
        } else {
          setOrderId(res[0]);
          clientWithStateManager!
            .stateManager!.orders.get(res[0])
            .then((order) => {
              const orderItems = order.items;
              setCurrentCart(orderItems);
            })
        }
      })
  }, []);

  useEffect(() => {
    function txHashDetected(order: Order) {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        setOrderId(null);
      }
    }
    clientWithStateManager!.stateManager!.orders.on(
      "addPaymentTx",
      txHashDetected,
    );
    return () => {
      clientWithStateManager!.stateManager!.orders.removeListener(
        "addPaymentTx",
        txHashDetected,
      );
    };
  }, []);

  useEffect(() => {
    // Set up changeItems event listener.
    if (orderId) {
      const onChangeItems = (order: Order) => {
        if (order.id === orderId) {
          setCurrentCart(order.items);
        }
      };
      clientWithStateManager!.stateManager!.orders.on(
        "changeItems",
        onChangeItems,
      );
      return () => {
        // Cleanup listeners on unmount
        clientWithStateManager!.stateManager!.orders.removeListener(
          "changeItems",
          onChangeItems,
        );
      };
    }
  });

  useEffect(() => {
    if (itemId) {
      //set item details
      getBaseTokenInfo()
        .then((baseTokenInfo) => {
          clientWithStateManager!
            .stateManager!.listings.get(itemId)
            .then((item) => {
              setItem(item);
              const price = formatUnitsFromString(
                item.price,
                baseTokenInfo?.[1] || 0,
              );
              setPrice(price);
              if (!currentCartItems) return;
              //Check if item is already added to cart
              if (itemId in currentCartItems) {
                setAddedToCart(true);
                setQuantity(currentCartItems[itemId]);
              }
            })
        })
        
    }
  }, [currentCartItems, itemId]);

  async function getAllTags() {
    const tags = new Map();
    for await (const [
      id,
      tag,
    ] of clientWithStateManager!.stateManager!.tags.iterator()) {
      tags.set(id, tag);
    }
    return tags;
  }

  useEffect(() => {
    const onCreateTag = (tag: Tag) => {
      allTags.set(tag.id, tag);
      setAllTags(allTags);
    };
    getAllTags()
      .then((tags) => {
        setAllTags(tags);
      })

    // Listen to future events
    clientWithStateManager!.stateManager!.tags.on("create", onCreateTag);

    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager!.stateManager!.listings.removeListener(
        "create",
        onCreateTag,
      );
    };
  }, []);

  async function changeItems() {
    let order_id = orderId;
    if (
      !order_id &&
      (localStorage.getItem("merchantKC") ||
        localStorage.getItem("guestCheckoutKC"))
    ) {
      order_id = (await clientWithStateManager!.stateManager!.orders.create())
        .id;
      setOrderId(order_id);
    } else if (!order_id) {
      //For users with no enrolled KC: upgrade subscription when adding an item to cart.
      await upgradeGuestToCustomer();
      const kc = localStorage.getItem("guestCheckoutKC") as `0x${string}`;
      const keyCardWallet = privateKeyToAccount(kc);
      await clientWithStateManager!.stateManager!.keycards.addAddress(
        keyCardWallet.address,
      );
      order_id = (await clientWithStateManager!.stateManager!.orders.create())
        .id;
      setOrderId(order_id);
    }
    try {
      const diff = !addedToCart
        ? quantity
        : quantity - currentCartItems![itemId];

      if (diff > 0) {
        await clientWithStateManager!.stateManager!.orders.addItems(order_id, [
          { listingId: itemId, quantity: diff },
        ]);
      } else {
        await clientWithStateManager!.stateManager!.orders.removeItems(
          order_id,
          [
            {
              listingId: itemId,
              quantity: currentCartItems![itemId]! - quantity,
            },
          ],
        );
      }
      setMsg("Added to cart");
      setButton("Review");
    } catch (error) {
      Sentry.captureException(error);
      setErrorMsg("There was an error updating cart");
    }
  }

  if (!item) return null;

  function getCtaButton() {
    if (!addedToCart) {
      return (
        <Button
          data-testid="addToCart"
          disabled={!quantity}
          onClick={changeItems}
        >
          {(Number(price) * quantity).toFixed(2)}
        </Button>
      );
    } else if (quantity !== currentCartItems?.[itemId]) {
      return (
        <Button data-testid="updateQty" onClick={changeItems}>
          Update Sale
        </Button>
      );
    } else if (buttonState === "Review") {
      return (
        <Button
          onClick={() =>
            router.push(
              `/checkout?${createQueryString("step", "cart", searchParams)}`,
            )
          }
        >
          Review Sale
        </Button>
      );
    }
  }

  function handlePurchaseQty(e: ChangeEvent<HTMLInputElement>) {
    if (typeof Number(e.target.value) !== "number") {
      return;
    }
    setQuantity(Number(e.target.value));
  }

  return (
    <main className="pt-under-nav h-screen bg-gray-100">
      <section className="h-[45rem] flex flex-col">
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
            router.push("/products");
          }}
        />
        <div className="m-4">
          <BackButton href="/products" />
          <div className="my-3 flex">
            <h1 data-testid="title">{item.metadata.title}</h1>
            <div className={`ml-auto ${isMerchantView ? "" : "hidden"}`}>
              <Button>
                <Link
                  href={`/products/edit?${createQueryString(
                    "itemId",
                    item.id,
                    searchParams,
                  )}`}
                >
                  Edit
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <Image
              src={item.metadata.images[0]}
              alt="product-detail-image"
              width={380}
              height={250}
              className="border rounded-lg"
              unoptimized={true}
              style={{
                maxHeight: "250px",
                width: "full",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            {item.metadata.images.length > 1 ? (
              <div className="flex mt-2 gap-2">
                {item.metadata.images.map((image, i) => {
                  return (
                    <Image
                      key={i}
                      src={image}
                      alt="product-detail-image"
                      width={90}
                      height={81}
                      className="border rounded-lg"
                      unoptimized={true}
                      style={{
                        maxHeight: "81px",
                        maxWidth: "90px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
          <section className="flex gap-4 flex-col bg-white mt-5 rounded-md p-5">
            <div>
              <h2 className="font-sans text-gray-700">Description</h2>
              <p data-testid="description">{item.metadata.description}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/usdc-coin.png"
                alt="coin"
                width={24}
                height={24}
                unoptimized={true}
                className="w-6 h-6 max-h-6"
              />
              <h1 data-testid="price">{Number(price).toFixed(2)}</h1>
            </div>
            <div className="flex gap-6">
              <div className="">
                <p className="text-xs text-primary-gray mb-2">Quantity</p>
                <input
                  className="border-2 border-solid p-3 rounded-md max-w-14"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  data-testid="purchaseQty"
                  type="number"
                  onChange={(e) => handlePurchaseQty(e)}
                />
              </div>
              <div>
                <h5 className="text-xs text-primary-gray mb-2">
                  Add to basket
                </h5>
                <div>{getCtaButton()}</div>
              </div>
            </div>
            <SuccessToast message={successMsg} onClose={() => setMsg(null)} />
          </section>
        </div>
      </section>
    </main>
  );
};
export default ProductDetail;
