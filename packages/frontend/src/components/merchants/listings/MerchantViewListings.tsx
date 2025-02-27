// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { Link } from "@tanstack/react-router";

import { formatUnitsFromString } from "@massmarket/utils";

import Button from "../../common/Button.tsx";
import { Listing, ListingViewState } from "../../../types.ts";
import { useBaseToken } from "../../../hooks/useBaseToken.ts";

export default function MerchantViewProducts({
  products,
}: {
  products: Listing[] | null;
}) {
  const { baseToken } = useBaseToken();

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
          className={`${!visible ? "opacity-50" : ""} flex w-full h-auto mb-4`}
          to="/listing-detail"
          search={(prev: Record<string, string>) => ({
            shopId: prev.shopId,
            itemId: item.id,
          })}
        >
          <div className="flex justify-center" data-testid="product-img">
            <img
              src={metadata.images[0] || "/assets/no-image.png"}
              width={127}
              height={112}
              alt="product-thumb"
              className="w-32 h-28 object-cover object-center rounded-l-lg"
            />
          </div>
          <div className="bg-background-gray w-full rounded-r-lg px-5 py-4">
            <div className="flex">
              <h3 data-testid="product-name" className="leading-4">
                {metadata.title}
              </h3>
              <img
                src={`/icons/chevron-right.svg`}
                width={7}
                height={4}
                alt="chevron-right"
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
                {baseToken &&
                  formatUnitsFromString(item.price, baseToken.decimals)}
              </p>
            </div>
          </div>
        </Link>
      );
    });
  }

  return (
    <section className="mx-5 pt-3" data-testid="merchant-view-listings">
      <div className="flex">
        <h1 className="grow flex items-center">Manage Products</h1>
        <Button custom="w-30">
          <Link
            to="/edit-listing"
            search={(prev: Record<string, string>) => ({
              shopId: prev.shopId,
              itemId: "new",
            })}
            className="text-white"
          >
            Add new +
          </Link>
        </Button>
      </div>
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
        <div className="flex gap-2 text-sm">
          <button className="ml-auto flex items-center gap-2 bg-white p-0">
            <p>Filter</p>
            <img
              src="/icons/filter.svg"
              width={12}
              height={12}
              alt="filter-icon"
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
