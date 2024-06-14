// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Sort from "../common/components/Sort";
import Search from "../common/components/Search";
import { SortOption, IProduct, TagId } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import Link from "next/link";
import withAuth from "../components/withAuth";
import SuccessMessage from "../common/components/SuccessMessage";
import { useSearchParams, useRouter } from "next/navigation";
import { createQueryString } from "@/app/utils";
import SecondaryButton from "../common/components/SecondaryButton";

const Products = () => {
  const searchParams = useSearchParams();
  const success = searchParams?.get("success");
  const router = useRouter();
  const [sortOpened, setSortOpened] = useState<boolean>(false);
  const [sortOption, setCheck] = useState<SortOption>(SortOption.default);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [showSuccessMsg, setMsg] = useState<boolean>(success !== null);
  const { products, publishedTagId, allTags } = useStoreContext();
  const [arrToRender, setArrToRender] = useState<IProduct[] | null>(null);
  // const [resultCount, setResultCount] = useState<number>(products.size);
  const [showTags, setShowTags] = useState<boolean>(false);
  const [tagIdToFilter, setTagIdToFilter] = useState<null | TagId>(null);

  const findRemoveTagId = () => {
    for (const [key, value] of allTags.entries()) {
      if (value.text && value.text === "remove") {
        return key;
      }
    }
    return null;
  };
  const removeTagId = findRemoveTagId();

  useEffect(() => {
    if (!products) return;
    const sorted = getSorted();
    const arrayToRender = sorted.filter((item) => {
      if (!item || !item.metadata?.image) {
        return false;
      } else if (
        removeTagId &&
        item.tagIds &&
        item.tagIds.includes(removeTagId)
      ) {
        return false;
      } else if (tagIdToFilter && item.tagIds?.includes(tagIdToFilter)) {
        return false;
      }
      return true;
    });

    arrayToRender.length && setArrToRender(arrayToRender);
    // setResultCount(arrayToRender.length);
  }, [sortOption, products, tagIdToFilter]);

  const viewProductDetails = (item: IProduct) => {
    router.push(
      `/products/productDetail?${createQueryString("itemId", item.id, searchParams)}`,
    );
  };

  const getSorted = () => {
    const arr = Array.from([...products.values()]);
    switch (sortOption) {
      case SortOption.default:
        return arr;
      case SortOption.priceLow:
        return arr.sort((a, b) => Number(a.price) - Number(b.price));
      case SortOption.priceHigh:
        return arr.sort((a, b) => Number(b.price) - Number(a.price));
      case SortOption.newest:
        return arr.reverse();
      case SortOption.hidden:
        return !publishedTagId
          ? arr
          : arr.filter(
              (product) =>
                !product?.tagIds || !product.tagIds.includes(publishedTagId),
            );
      case SortOption.available:
        return arr.filter(
          (product) =>
            product.stockQty &&
            publishedTagId &&
            product.tagIds &&
            product.tagIds?.includes(publishedTagId),
        );
      case SortOption.unavailable:
        return arr.filter((product) => !product.stockQty);
      default:
        return arr;
    }
  };

  const renderProducts = () => {
    if (!arrToRender?.length) return null;
    return arrToRender.map((item) => {
      const { metadata } = item;
      if (!metadata) return null;
      if (searchPhrase?.length) {
        if (
          !metadata.title.toLowerCase().includes(searchPhrase.toLowerCase())
        ) {
          return;
        }
      }
      const visible =
        publishedTagId && item.tagIds && item.tagIds.includes(publishedTagId);

      return (
        <div
          onClick={() => viewProductDetails(item)}
          key={item.id}
          className={`flex ${!visible ? "opacity-50" : ""}`}
        >
          <div className="border p-1 rounded bg-white">
            <Image
              src={metadata.image || "/assets/no-image.png"}
              width={64}
              height={64}
              alt="product-thumb"
              unoptimized={true}
              style={{ maxHeight: "64px", maxWidth: "64px" }}
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = "/assets/no-image.png";
              }}
            />
          </div>
          <div
            className="flex flex-col ml-4"
            data-testid={`product-${metadata.title}`}
          >
            <p data-testid={`product-title`}>{metadata.title}</p>
            <p className="text-sm">{item.price}</p>
            <p className="text-sm text-gray-400">{item.stockQty} Available</p>
          </div>
        </div>
      );
    });
  };

  return (
    <main className=" bg-gray-100 pt-under-nav h-screen">
      <SuccessMessage show={showSuccessMsg} onClose={() => setMsg(false)} />
      <Sort
        isOpen={sortOpened}
        close={() => setSortOpened(false)}
        sortOption={sortOption}
        setCheck={setCheck}
      />
      <section className="bg-gray-100 pb-6">
        <section className="m-4">
          <div className="flex pb-4">
            <p className="grow flex justify-center pl-10">EthDubai</p>
            <Link
              href={`/products/edit?${createQueryString("itemId", "new", searchParams)}`}
            >
              Add +
            </Link>
          </div>
          <Search
            setSearchPhrase={setSearchPhrase}
            searchPhrase={searchPhrase}
          />
          {/* <div className="flex gap-2 py-4 text-sm">
            <Image
              src="/assets/products.svg"
              width={19}
              height={19}
              alt="box-icon"
            />
            <p className="flex items-center">{resultCount} results</p>
            <div
              id="sortOption-button"
              className="flex border rounded-3xl	 py-2 px-4 bg-gray-200 ml-auto"
              onClick={() => setSortOpened(true)}
            >
              <p className="flex items-center">{sortOption}</p>
              <Image
                src="/assets/chevron-down.svg"
                width={19}
                height={19}
                alt="down-icon"
              />
            </div>
          </div> */}
          <div className="flex gap-2 py-4 text-sm">
            <SecondaryButton onClick={() => setSortOpened(true)}>
              Filters
            </SecondaryButton>
            <SecondaryButton
              onClick={() => {
                setShowTags(!showTags);
              }}
            >
              <div className="items-center flex gap-3">
                Tags
                <Image
                  src="/assets/tags.svg"
                  width={20}
                  height={12}
                  alt="tags"
                />
              </div>
            </SecondaryButton>
          </div>
          {showTags ? (
            <div className="inline-flex gap-3">
              <button className="bg-primary-blue text-white text-sm rounded p-2">
                Stickers
              </button>
              <button className="bg-primary-blue text-white text-sm rounded p-2">
                EthCC Exclusives
              </button>
              <button className="bg-primary-blue text-white  text-sm rounded p-2">
                Offers
              </button>
            </div>
          ) : null}
          <section className="flex flex-col gap-4 mt-4">
            {renderProducts()}
          </section>
        </section>
      </section>
    </main>
  );
};

export default withAuth(Products);
