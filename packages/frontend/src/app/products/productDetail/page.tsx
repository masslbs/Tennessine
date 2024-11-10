// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { privateKeyToAccount } from "viem/accounts";

import { formatUnitsFromString, logger } from "@massmarket/utils";

import { Listing, ListingId } from "@/types";
import { createQueryString } from "@/app/utils";
import { useStoreContext } from "@/context/StoreContext";
import { useUserContext } from "@/context/UserContext";
import { useClient } from "@/context/AuthContext";
import withClient from "@/app/components/withClient";
import Button from "@/app/common/components/Button";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import BackButton from "@/app/common/components/BackButton";
import SuccessToast from "@/app/common/components/SuccessToast";

const namespace = "frontend:product-detail";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

const ProductDetail = () => {
  const { getBaseTokenInfo, getOpenOrderId } = useStoreContext();
  const { upgradeGuestToCustomer, clientWithStateManager } = useUserContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMerchantView } = useClient();
  const itemId = searchParams.get("itemId") as ListingId;

  const [quantity, setQuantity] = useState<number>(0);
  const [item, setItem] = useState<Listing | null>(null);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [price, setPrice] = useState("");
  const [tokenIcon, setIcon] = useState("/icons/usdc-coin.png");
  const [successMsg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (itemId) {
      //set item details
      getBaseTokenInfo().then((baseTokenInfo) => {
        clientWithStateManager.stateManager.listings
          .get(itemId)
          .then((item) => {
            setItem(item);
            const price = formatUnitsFromString(
              item.price,
              baseTokenInfo?.[1] || 0,
            );
            if (baseTokenInfo?.[0] === "ETH") {
              setIcon("/icons/eth-coin.svg");
            }
            setPrice(price);
          });
      });
    }
  }, [itemId]);

  async function changeItems() {
    let orderId = await getOpenOrderId();
    if (
      !orderId &&
      (localStorage.getItem("merchantKC") ||
        localStorage.getItem("guestCheckoutKC"))
    ) {
      // If no open order, but already enrolled with a keycard, just create new order.
      orderId = (await clientWithStateManager.stateManager.orders.create()).id;
      debug("New order created");
    } else if (!orderId) {
      //For users with no enrolled KC: upgrade subscription when adding an item to cart.
      await upgradeGuestToCustomer();
      const kc = localStorage.getItem("guestCheckoutKC") as `0x${string}`;
      const keyCardWallet = privateKeyToAccount(kc);
      await clientWithStateManager.stateManager.keycards.addAddress(
        keyCardWallet.address,
      );
      orderId = (await clientWithStateManager.stateManager.orders.create()).id;
      debug("New order created");
    }
    try {
      await clientWithStateManager.stateManager.orders.addItems(orderId, [
        { listingId: itemId, quantity },
      ]);
      setQuantity(0);
      setMsg("Added to cart");
    } catch (error) {
      debug(`Error: changeItems ${error}`);
      setErrorMsg("There was an error updating cart");
    }
  }

  if (!item) return null;

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
                  href={`/products/edit?${
                    createQueryString(
                      "itemId",
                      item.id,
                    )
                  }`}
                >
                  Edit
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <img
              src={item.metadata.images[0]}
              alt="product-detail-image"
              width={380}
              height={250}
              className="border rounded-lg"
              style={{
                maxHeight: "250px",
                width: "full",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            {item.metadata.images.length > 1
              ? (
                <div className="flex mt-2 gap-2">
                  {item.metadata.images.map((image, i) => {
                    return (
                      <img
                        key={i}
                        src={image}
                        alt="product-detail-image"
                        width={90}
                        height={81}
                        className="border rounded-lg"
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
              )
              : null}
          </div>
          <section className="flex gap-4 flex-col bg-white mt-5 rounded-md p-5">
            <div>
              <h2 className="font-sans text-gray-700">Description</h2>
              <p data-testid="description">{item.metadata.description}</p>
            </div>
            <div className="flex gap-2 items-center">
              <img
                src={tokenIcon}
                alt="coin"
                width={24}
                height={24}
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
                <Button onClick={changeItems} disabled={!quantity}>
                  <div className="flex items-center gap-2">
                    <p>Add to basket</p>
                    <img
                      src="/icons/white-arrow.svg"
                      alt="white-arrow"
                      width={7}
                      height={12}
                      style={{ display: quantity ? "" : "none" }}
                    />
                  </div>
                </Button>
              </div>
            </div>
            <SuccessToast message={successMsg} onClose={() => setMsg(null)} />
          </section>
        </div>
      </section>
    </main>
  );
};
export default withClient(ProductDetail);
