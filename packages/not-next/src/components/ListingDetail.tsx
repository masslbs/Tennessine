// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";

import { formatUnitsFromString, logger } from "@massmarket/utils";

import { Listing, ListingId } from "../types.ts";
import Button from "./common/Button.tsx";
import BackButton from "./common/BackButton.tsx";
import { useBaseToken } from "../hooks/useBaseToken.ts";
import { useClientWithStateManager } from "../hooks/useClientWithStateManager.ts";
import { useKeycard } from "../hooks/useKeycard.ts";
import ErrorMessage from "./common/ErrorMessage.tsx";
import SuccessToast from "./common/SuccessToast.tsx";
import { useCurrentOrder } from "../hooks/useCurrentOrder.ts";

const namespace = "frontend:listing-detail";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function ListingDetail() {
  const { baseToken } = useBaseToken();
  const { clientStateManager } = useClientWithStateManager();
  const [keycard] = useKeycard();
  const search = useSearch({ strict: false });
  const { currentOrder } = useCurrentOrder();
  const itemId = search.itemId as ListingId | "new";
  debug(`item ID: ${itemId}`);

  const [item, setItem] = useState<Listing | null>(null);
  const [price, setPrice] = useState("");
  const [tokenIcon, setIcon] = useState("/icons/usdc-coin.png");
  const [quantity, setQuantity] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [successMsg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (itemId && baseToken) {
      //set item details
      clientStateManager!.stateManager.listings
        .get(itemId)
        .then((item: Listing) => {
          setItem(item);
          const price = formatUnitsFromString(
            item.price,
            baseToken?.decimals || 0,
          );
          if (baseToken?.symbol === "ETH") {
            setIcon("/icons/eth-coin.svg");
          }
          setPrice(price);
        });
    }
  }, [itemId, baseToken]);

  if (!item) return null;

  function handlePurchaseQty(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value.replace(/^0+/, "");
    setQuantity(newValue);
  }

  async function changeItems() {
    let orderId = currentOrder;
    if (
      !orderId
    ) {
      orderId = (await clientStateManager!.stateManager.orders.create()).id;
      debug(`New Order ID: ${orderId}`);
    }
    try {
      await clientStateManager!.stateManager.orders.addItems(orderId, [
        { listingId: itemId, quantity: Number(quantity) },
      ]);
      setQuantity("");
      setMsg("Added to cart");
    } catch (error) {
      errlog(`Error: changeItems ${error}`);
      setErrorMsg("There was an error updating cart");
    }
  }

  return (
    <main className="bg-gray-100 pt-under-nav">
      <section className="flex flex-col">
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <div className="m-4">
          <BackButton href="/listings" />
          <div className="my-3 flex flex-col">
            <h1 data-testid="title">{item.metadata.title}</h1>
            <div
              className={`ml-auto ${
                keycard.role === "merchant" ? "" : "hidden"
              }`}
            >
              <Button custom="w-6/12">
                <Link
                  to="/edit-listing"
                  search={(prev: Record<string, string>) => ({
                    shopId: prev.shopId,
                    itemId: item.id,
                  })}
                >
                  Edit Product
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
                  {item.metadata.images.map((image: string, i: number) => {
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
              <div>
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
              <div className="flex items-end">
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
}
