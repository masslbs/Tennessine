// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { formatUnitsFromString, logger } from "@massmarket/utils";
import { Item, ListingViewState } from "@/types";
import { createQueryString } from "@/app/utils";
import { useStoreContext } from "@/context/StoreContext";

const debug = logger("frontend:CustomerViewProducts");

function CustomerViewProducts({ products }: { products: Item[] | null }) {
  const { getBaseTokenInfo } = useStoreContext();
  const searchParams = useSearchParams();
  const [baseDecimal, setBaseDecimal] = useState<null | number>(null);

  useEffect(() => {
    getBaseTokenInfo()
      .then((res: [string, number]) => {
        res && setBaseDecimal(res[1]);
      })
  }, []);

  function renderProducts() {
    if (!products?.length)
      return (
        <div className="flex justify-center w-full mb-4">
          <p>No Products</p>
        </div>
      );
    return products.map((item) => {
      const { metadata } = item;
      if (!metadata) return null;
      const visible =
        item.viewState === ListingViewState.LISTING_VIEW_STATE_PUBLISHED;

      return (
        <Link
          key={item.id}
          data-testid="product-container"
          href={`/products/productDetail?${createQueryString("itemId", item.id, searchParams)}`}
          className={`${!visible ? "opacity-50" : ""}`}
        >
          <div>
            <div className="flex justify-center" data-testid={`product-img`}>
              <Image
                src={metadata.images[0] || "/assets/no-image.png"}
                width={176}
                height={144}
                alt="product-thumb"
                unoptimized={true}
                placeholder="empty"
                priority={true}
                className="h-36 w-44 rounded-t-lg object-cover object-center"
              />
            </div>
            <div className="bg-white flex flex-col gap-2 rounded-b-lg p-3 min-h-24 max-h-24 h-24 w-44">
              <div className="min-h-8">
                <h3 data-testid="product-name" className="leading-4">
                  {item.metadata.title}
                </h3>
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  src="/icons/usdc-coin.png"
                  alt="coin"
                  width={20}
                  height={20}
                  unoptimized={true}
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
    <section className="mx-5 mt-2">
      <div className="flex">
        <h1 className="grow flex items-center">Shop</h1>
        <button>Search</button>
        <button className="ml-2">Filter</button>
      </div>
      <section className="flex flex-wrap justify-between gap-3 mt-3">
        {renderProducts()}
      </section>
    </section>
  );
}
export default CustomerViewProducts;
