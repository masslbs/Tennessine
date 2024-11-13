// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { formatUnitsFromString } from "@massmarket/utils";
import { Listing, ListingViewState } from "@/types";
import { createQueryString } from "@/app/utils";
import { useStoreContext } from "@/context/StoreContext";

function CustomerViewProducts({ products }: { products: Listing[] | null }) {
  const { getBaseTokenInfo } = useStoreContext();
  const [baseDecimal, setBaseDecimal] = useState<null | number>(null);
  const [tokenIcon, setIcon] = useState<string>("/icons/usdc-coin.png");

  useEffect(() => {
    getBaseTokenInfo().then((res: [string, number]) => {
      res && setBaseDecimal(res[1]);
      if (res[0] === "ETH") {
        setIcon("/icons/eth-coin.svg");
      }
    });
  }, []);

  function renderProducts() {
    if (!products?.length) {
      return (
        <div className="flex justify-center w-full mb-4">
          <p>No Products</p>
        </div>
      );
    }
    return products.map((item) => {
      const { metadata } = item;
      if (!metadata) return null;
      const visible =
        item.viewState === ListingViewState.LISTING_VIEW_STATE_PUBLISHED;

      return (
        <Link
          key={item.id}
          data-testid="product-container"
          href={`/products/productDetail?${
            createQueryString(
              "itemId",
              item.id,
            )
          }`}
          className={`${!visible ? "opacity-50" : ""}`}
        >
          <div>
            <div className="flex justify-center" data-testid={`product-img`}>
              <img
                src={metadata.images[0] || "/assets/no-image.png"}
                width={160}
                height={144}
                alt="product-thumb"
                className="h-36 w-40 rounded-t-lg object-cover object-center xxs:w-36"
              />
            </div>
            <div className="bg-white flex flex-col gap-2 rounded-b-lg p-3 min-h-24 max-h-24 h-24 w-40 xxs:w-36">
              <div className="min-h-8">
                <h3 data-testid="product-name" className="leading-4">
                  {item.metadata.title}
                </h3>
              </div>
              <div className="flex gap-2 items-center">
                <img
                  src={tokenIcon}
                  alt="coin"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <p>
                  {baseDecimal &&
                    formatUnitsFromString(item.price, baseDecimal)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  }
  return (
    <section className="mt-2">
      <div className="flex">
        <h1 className="grow flex items-center px-6">Shop</h1>
      </div>
      <section className="flex justify-center">
        <section className="flex flex-wrap justify-between gap-3 mt-3 w-5/6 max-w-screen-sm">
          {renderProducts()}
        </section>
      </section>
    </section>
  );
}
export default CustomerViewProducts;
