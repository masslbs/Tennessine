// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";

import { formatUnitsFromString, logger } from "@massmarket/utils";

import { Listing, ListingId } from "../types.ts";
import Button from "./common/Button.tsx";
import BackButton from "./common/BackButton.tsx";
import { useBaseToken } from "../hooks/useBaseToken.ts";
import { useClientWithStateManager } from "../hooks/useClientWithStateManager.ts";
import { useKeycard } from "../hooks/useKeycard.ts";

const namespace = "frontend:product-detail";
const debug = logger(namespace);

export default function ProductDetail() {
  const { baseToken } = useBaseToken();
  const { clientStateManager } = useClientWithStateManager();
  const [keycard] = useKeycard();
  const search = useSearch({ strict: false });
  const itemId = search.itemId as ListingId | "new";
  debug(`item ID: ${itemId}`);
  const [item, setItem] = useState<Listing | null>(null);
  const [price, setPrice] = useState("");
  const [tokenIcon, setIcon] = useState("/icons/usdc-coin.png");

  useEffect(() => {
    if (itemId) {
      //set item details
      clientStateManager!.stateManager.listings
        .get(itemId)
        .then((item) => {
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
  }, [itemId]);

  if (!item) return null;

  return (
    <main className="h-screen bg-gray-100">
      <section className="h-[45rem] flex flex-col">
        <div className="m-4">
          <BackButton href="/products" />
          <div className="my-3 flex flex-col">
            <h1 data-testid="title">{item.metadata.title}</h1>
            <div
              className={`ml-auto ${
                keycard.role === "merchant" ? "" : "hidden"
              }`}
            >
              <Button custom="w-6/12">
                <Link
                  to="/edit-product"
                  search={(prev) => ({ ...prev, itemId: item.id })}
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
              </div>
              <div>
                <h5 className="text-xs text-primary-gray mb-2">
                  Add to basket
                </h5>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
