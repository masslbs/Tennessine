// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import debugLib from "debug";

import { createQueryString } from "@/app/utils";
import { formatUnitsFromString } from "@massmarket/utils";
import { useStoreContext } from "@/context/StoreContext";

import { Item, ListingViewState } from "@/types";

function CustomerViewProducts({ products }: { products: Item[] | null }) {
  const debug = debugLib("frontend:CustomerViewProducts");
  const { getBaseTokenInfo } = useStoreContext();
  const searchParams = useSearchParams();
  const [baseDecimal, setBaseDecimal] = useState<null | number>(null);

  useEffect(() => {
    getBaseTokenInfo()
      .then((res: [string, number]) => {
        res && setBaseDecimal(res[1]);
      })
      .catch((e) => debug(e));
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
                height={150}
                alt="product-thumb"
                unoptimized={true}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  maxHeight: 150,
                  maxWidth: 176,
                  minHeight: 150,
                  minWidth: 176,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
                className="w-auto h-auto"
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
                  className="w-auto h-auto max-h-5"
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
      <section className="flex flex-wrap justify-between gap-2 mt-3">
        {renderProducts()}
      </section>
    </section>
  );
}
export default CustomerViewProducts;
