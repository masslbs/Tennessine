// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Link } from "@tanstack/react-router";
import { formatUnits } from "viem";

import { Listing } from "@massmarket/schema";
import { usePricingCurrency } from "@massmarket/react-hooks";

import { ListingViewState } from "../types.ts";

export default function CustomerViewProducts({
  products,
}: {
  products: Listing[] | null;
}) {
  const { pricingCurrency } = usePricingCurrency();

  function renderProducts() {
    if (!products?.length || !pricingCurrency) {
      return (
        <div className="flex justify-center w-full mb-4">
          <p>No Products</p>
        </div>
      );
    }
    return products.map((item: Listing) => {
      const visible = item.ViewState === ListingViewState.Published;
      if (!visible) return null;

      let productImage = "/assets/no-image.png";
      if (item.Metadata.Images && item.Metadata.Images.length > 0) {
        productImage = item.Metadata.Images[0];
      }
      return (
        <Link
          key={item.ID}
          data-testid="product-container"
          to="/listing-detail"
          search={(prev: Record<string, string>) => ({
            shopId: prev.shopId,
            itemId: item.ID,
          })}
          style={{ color: "black" }}
        >
          <div className="w-40 xxs:w-36 md:w-[190px]">
            <div data-testid="product-img">
              <img
                src={productImage}
                width={160}
                height={144}
                alt="product-thumb"
                className="h-36 rounded-t-lg object-cover object-center w-full"
              />
            </div>
            <div className="bg-white flex flex-col gap-2 rounded-b-lg p-3 h-26 w-full">
              <div className="min-h-12">
                <h3
                  data-testid="product-name"
                  className="leading-6 line-clamp-2 md:p-1"
                >
                  {item.Metadata.Title}
                </h3>
              </div>
              <div className="flex gap-2 items-center">
                <img
                  src={pricingCurrency?.symbol === "ETH"
                    ? "/icons/eth-coin.svg"
                    : "/icons/usdc-coin.png"}
                  alt="coin"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                  data-testid="coin-icon"
                />
                <p data-testid="product-price" className="truncate">
                  {formatUnits(item.Price, pricingCurrency!.decimals)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  }
  return (
    <section
      className="mt-[10px] flex justify-center"
      data-testid="customer-view-listings"
    >
      <section>
        <h1>Shop</h1>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-[10px]">
          {renderProducts()}
        </section>
      </section>
    </section>
  );
}
