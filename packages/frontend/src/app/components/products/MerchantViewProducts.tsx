// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import debugLib from "debug";

import Button from "@/app/common/components/Button";
import { createQueryString } from "@/app/utils";
import { formatUnitsFromString } from "@massmarket/utils";
import { useStoreContext } from "@/context/StoreContext";

import { Item, ListingViewState } from "@/types";

function MerchantViewProducts({ products }: { products: Item[] | null }) {
  const debug = debugLib("frontend: MerchantViewProducts");

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
          className={`${!visible ? "opacity-50" : ""} flex w-full h-auto mb-4`}
        >
          <div className="flex justify-center" data-testid="product-img">
            <Image
              src={metadata.images[0] || "/assets/no-image.png"}
              width={127}
              height={112}
              placeholder="empty"
              priority={true}
              alt="product-thumb"
              unoptimized={true}
              className="w-32 h-28 object-cover object-center rounded-l-lg"
            />
          </div>
          <div className="bg-background-gray w-full rounded-r-lg px-5 py-4">
            <div className="flex">
              <h3 data-testid="product-name" className="leading-4">
                {metadata.title}
              </h3>
              <Image
                src={`/icons/chevron-right.svg`}
                width={7}
                height={4}
                alt="chevron-right"
                unoptimized={true}
                className="w-auto h-auto ml-auto"
              />
            </div>
            <div className="flex justify-between mt-1">
              <p>Stock Level</p>
              <p>{item.quantity}</p>
            </div>
            <div className="flex justify-between">
              <p>Price</p>
              <p data-testid={`product-price`}>
                {baseDecimal && formatUnitsFromString(item.price, baseDecimal)}
              </p>
            </div>
          </div>
        </Link>
      );
    });
  }
  return (
    <section className="m-5">
      <div className="flex">
        <h1 className="grow flex items-center">Manage Products</h1>
        <Button custom="w-30">
          <Link
            href={`/products/edit?${createQueryString("itemId", "new", searchParams)}`}
          >
            Add new +
          </Link>
        </Button>
      </div>
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
        <div className="flex gap-2 text-sm">
          {/* <Search
            setSearchPhrase={setSearchPhrase}
            searchPhrase={searchPhrase}
          /> */}
          <button className="ml-auto flex items-center gap-2">
            <p>Filter</p>
            <Image
              src="/icons/filter.svg"
              width={12}
              height={12}
              alt="filter-icon"
              unoptimized={true}
              className="w-3 h-3"
            />
          </button>
        </div>
        <section className="product-list-container flex flex-col gap-4">
          <div className="flex flex-wrap">{renderProducts()}</div>
        </section>
      </section>
    </section>
  );
}
export default MerchantViewProducts;
