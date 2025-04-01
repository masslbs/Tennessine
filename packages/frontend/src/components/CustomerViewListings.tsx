// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Link } from "@tanstack/react-router";

import { Listing } from "@massmarket/schema";

import { formatUnitsFromString } from "@massmarket/utils";
import { ListingViewState } from "../types.ts";
import { useBaseToken } from "../hooks/useBaseToken.ts";

export default function CustomerViewProducts({
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
    return products.map((item: Listing) => {
      const visible = item.ViewState === ListingViewState.Published;

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
          className={`${!visible ? "hidden" : "text-black"}`}
        >
          <div>
            <div data-testid="product-img">
              <img
                src={productImage}
                width={160}
                height={144}
                alt="product-thumb"
                className="h-36 w-40 rounded-t-lg object-cover object-center xxs:w-36"
              />
            </div>
            <div className="bg-white flex flex-col gap-2 rounded-b-lg p-3 min-h-24 max-h-24 h-24 w-40 xxs:w-36">
              <div className="min-h-8">
                <h3 data-testid="product-name" className="leading-4">
                  {item.Metadata.Title}
                </h3>
              </div>
              <div className="flex gap-2 items-center">
                <img
                  src={baseToken?.symbol === "ETH"
                    ? "/icons/eth-coin.svg"
                    : "/icons/usdc-coin.png"}
                  alt="coin"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                  data-testid="coin-icon"
                />
                <p data-testid="product-price">
                  {baseToken &&
                    formatUnitsFromString(
                      item.Price.toString(),
                      baseToken.decimals,
                    )}
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
      className="mt-2 flex justify-center"
      data-testid="customer-view-listings"
    >
      <section>
        <h1>Shop</h1>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-5">
          {renderProducts()}
        </section>
      </section>
    </section>
  );
}
