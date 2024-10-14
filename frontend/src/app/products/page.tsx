// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Sort from "@/app/common/components/Sort";
import Search from "@/app/common/components/Search";
import { SortOption, Item, TagId, Tag, ListingViewState } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import withAuth from "@/app/components/withAuth";
import SuccessMessage from "@/app/common/components/SuccessMessage";
import { useSearchParams, useRouter } from "next/navigation";
import { createQueryString } from "@/app/utils";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import CartButton from "@/app/components/checkout/CartButton";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import debugLib from "debug";
import { formatUnitsFromString } from "@massmarket/utils";

const Products = () => {
  const searchParams = useSearchParams();
  const success = searchParams?.get("success");
  const router = useRouter();
  const [sortOpened, setSortOpened] = useState<boolean>(false);
  const [sortOption, setCheck] = useState<SortOption>(SortOption.default);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [showSuccessMsg, setMsg] = useState<boolean>(success !== null);
  const { stateManager, baseTokenDetails, shopDetails } = useStoreContext();
  const [products, setProducts] = useState(new Map());
  const [arrToRender, setArrToRender] = useState<Item[] | null>(null);
  const [resultCount, setResultCount] = useState<number>(products.size);
  const [showTags, setShowTags] = useState<boolean>(false);
  const [tagIdToFilter, setTagIdToFilter] = useState<null | TagId>(null);
  const [gridView, setGridView] = useState<boolean>(true);
  const [allTags, setAllTags] = useState(new Map());
  const { isMerchantView } = useAuth();
  const debug = debugLib("frontend:products");

  const getAllListings = async () => {
    const listings = new Map();
    for await (const [id, item] of stateManager.items.iterator()) {
      listings.set(id, item);
    }
    return listings;
  };

  useEffect(() => {
    const onCreateEvent = async () => {
      const l = new Map();
      for await (const [id, item] of stateManager.items.iterator()) {
        l.set(id, item);
      }
      setProducts(l);
    };
    const onUpdateEvent = async () => {
      const l = new Map();
      for await (const [id, item] of stateManager.items.iterator()) {
        l.set(id, item);
      }
      setProducts(l);
    };
    const onAddItemId = (item: Item) => {
      products.set(item.id, item);
      setProducts(products);
    };
    const onRemoveItemId = (item: Item) => {
      products.set(item.id, item);
      setProducts(products);
    };
    getAllListings()
      .then((listings) => {
        setProducts(listings);
      })
      .catch((e) => {
        debug(e);
      });

    // Listen to future events
    stateManager.items.on("create", onCreateEvent);
    stateManager.items.on("update", onUpdateEvent);
    stateManager.items.on("addItemId", onAddItemId);
    stateManager.items.on("removeItemId", onRemoveItemId);

    return () => {
      // Cleanup listeners on unmount
      stateManager.items.removeListener("create", onCreateEvent);
      stateManager.items.removeListener("update", onUpdateEvent);
      stateManager.items.removeListener("addItemId", onAddItemId);
      stateManager.items.removeListener("removeItemId", onRemoveItemId);
    };
  }, []);

  useEffect(() => {
    const onCreateEvent = (tag: Tag) => {
      allTags.set(tag.id, tag);
      setAllTags(allTags);
    };

    // Listen to future events
    stateManager.tags.on("create", onCreateEvent);

    return () => {
      // Cleanup listeners on unmount
      stateManager.items.removeListener("create", onCreateEvent);
    };
  }, []);

  useEffect(() => {
    if (!products) return;
    const arrayToRender = getSorted();
    arrayToRender.length && setArrToRender(arrayToRender);
    setResultCount(arrayToRender.length);
  }, [sortOption, products, tagIdToFilter]);

  const viewProductDetails = (item: Item) => {
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
        return arr.filter(
          (product) =>
            product.viewState ===
            ListingViewState.LISTING_VIEW_STATE_UNSPECIFIED,
        );
      case SortOption.available:
        return arr.filter(
          (product) =>
            product.quantity && ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
        );
      case SortOption.unavailable:
        return arr.filter((product) => !product.quantity);
      default:
        return arr;
    }
  };
  const renderFilterTags = () => {
    if (!allTags || !showTags) return null;
    const tags = Array.from([...allTags.keys()]);
    if (!tags?.length) return null;

    return (
      <div className="inline-flex gap-3">
        {tags.map((t: TagId) => {
          const tag = allTags.get(t) as Tag;
          return (
            <button
              key={t}
              onClick={() => setTagIdToFilter(t)}
              className="bg-primary-blue text-white text-sm rounded p-2"
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    );
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
        item.viewState === ListingViewState.LISTING_VIEW_STATE_PUBLISHED;

      return (
        <div key={item.id} className="mt-4 mx-4 last: mr-0">
          <div
            data-testid="product-container"
            onClick={() => viewProductDetails(item)}
            className={`flex flex-col text-center ${!visible ? "opacity-50" : ""} max-w-24 min-w-24 min-h-30 max-h-30`}
          >
            <div className="h-12 flex justify-center text-center">
              <p
                className="text-xs text-center text-ellipsis overflow-hidden self-end"
                data-testid={`product-name`}
              >
                {metadata.title}
              </p>
            </div>
            <div className="product-box gap-2 flex flex-col text-center border-2 p-3 rounded-xl bg-white">
              <div
                className="flex justify-center min-h-16"
                data-testid={`product-img`}
              >
                <Image
                  src={metadata.images[0] || "/assets/no-image.png"}
                  width={85}
                  height={60}
                  alt="product-thumb"
                  unoptimized={true}
                  style={{ maxHeight: "60px", maxWidth: "85px" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = "/assets/no-image.png";
                  }}
                />
              </div>
              <h4 data-testid={`product-price`}>
                {formatUnitsFromString(item.price, baseTokenDetails.decimal)}
              </h4>
              <p className="text-sm text-gray-400">{item.quantity} left</p>
            </div>
          </div>
          {isMerchantView && (
            <div className="mt-2">
              <SecondaryButton>
                <Link
                  href={`/products/edit?${createQueryString("itemId", item.id, searchParams)}`}
                >
                  Edit
                </Link>
              </SecondaryButton>
            </div>
          )}
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
            <h2 className="grow flex">{shopDetails.name}</h2>
            <CartButton />
          </div>
          <Search
            setSearchPhrase={setSearchPhrase}
            searchPhrase={searchPhrase}
          />

          <div className="flex gap-2 py-4 text-sm">
            <SecondaryButton onClick={() => setSortOpened(true)}>
              <div className="items-center flex gap-3">
                Filters
                <Image
                  src="/assets/filters.png"
                  width={12}
                  height={12}
                  alt="filter"
                  unoptimized={true}
                />
              </div>
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
          {renderFilterTags()}

          <div className="flex gap-2 py-4 text-sm">
            <p className="flex items-center">{resultCount} items</p>
            <div className="flex ml-auto gap-2">
              <p
                className={` p-2 ${gridView ? "border bg-black rounded-3xl text-white" : ""}`}
                onClick={() => {
                  setGridView(true);
                }}
              >
                Grid
              </p>
              <p
                className={`p-2 ${!gridView ? "border bg-black rounded-3xl text-white" : ""}`}
                onClick={() => {
                  setGridView(false);
                }}
              >
                List
              </p>
            </div>
          </div>
          <section className="product-list-container flex flex-col gap-4 mt-4">
            <div className="flex flex-wrap">{renderProducts()}</div>
          </section>
        </section>
      </section>
    </main>
  );
};

export default withAuth(Products);
