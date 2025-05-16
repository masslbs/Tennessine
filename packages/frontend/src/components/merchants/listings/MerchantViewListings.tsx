// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { getLogger } from "@logtape/logtape";
import { Link } from "@tanstack/react-router";
import { formatUnits } from "viem";

import { Listing } from "@massmarket/schema";

import Button from "../../common/Button.tsx";
import { ListingViewState } from "../../../types.ts";
import { useBaseToken } from "../../../hooks/useBaseToken.ts";
import { useStateManager } from "../../../hooks/useStateManager.ts";

const logger = getLogger(["mass-market", "frontend", "MerchantViewProducts"]);

export default function MerchantViewProducts({
  products,
}: {
  products: Listing[] | null;
}) {
  const { baseToken } = useBaseToken();
  const { stateManager } = useStateManager();

  function renderProducts() {
    if (!stateManager) {
      logger.warn("stateManager not found");
      return;
    }
    if (!products?.length) {
      return (
        <div className="flex justify-center w-full mb-4">
          <p>No Products</p>
        </div>
      );
    }
    return products.map(async (item: Listing) => {
      const visible = item.ViewState === ListingViewState.Published;

      let productImage = "/assets/no-image.png";
      if (item.Metadata.Images && item.Metadata.Images.length > 0) {
        productImage = item.Metadata.Images[0];
      }

      const quantity = await stateManager.get(["Inventory", item.ID]) as number;

      return (
        <Link
          key={item.ID}
          data-testid="product-container"
          className={`${!visible ? "opacity-50" : ""} flex w-full h-auto mb-4`}
          style={{ color: "black" }}
          to="/listing-detail"
          search={(prev: Record<string, string>) => ({
            shopId: prev.shopId,
            itemId: item.ID,
          })}
        >
          <div className="flex justify-center" data-testid="product-img">
            <img
              src={productImage}
              alt="product-thumb"
              style={{
                width: 127,
                minWidth: 127,
                height: "100%",
              }}
              className="h-full object-cover object-center rounded-l-lg"
            />
          </div>
          <div className="bg-background-gray w-full rounded-r-lg px-5 py-4 flex flex-col">
            <div className="flex border-b border-gray-300 w-full pb-3 gap-2">
              <h3 data-testid="product-name" className="leading-4 line-clamp-1">
                {item.Metadata.Title}
              </h3>
              <img
                src={`/icons/chevron-right.svg`}
                width={7}
                height={4}
                alt="chevron-right"
                className="w-auto h-auto ml-auto"
              />
            </div>
            <div className="flex justify-between mt-2 border-b border-gray-300 w-full pb-2">
              <p>Stock #</p>
              <p>{quantity}</p>
            </div>
            <div className="flex justify-between pt-2 mt-auto">
              <div className="flex gap-1 items-center">
                <img
                  src={baseToken?.symbol === "ETH"
                    ? "/icons/eth-coin.svg"
                    : "/icons/usdc-coin.png"}
                  alt="coin"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <p data-testid={`product-price`}>
                  {formatUnits(item.Price, baseToken.decimals)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  }

  return (
    <main className="flex justify-center">
      <section
        className="mx-5 md:mx-8 pt-3"
        data-testid="merchant-view-listings"
      >
        <div className="flex gap-2">
          <h1 className="grow flex items-center">Manage Products</h1>
          <Button custom="w-30">
            <Link
              to="/edit-listing"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
                itemId: "new",
              })}
              style={{
                color: "white",
              }}
            >
              Add new +
            </Link>
          </Button>
        </div>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderProducts()}
          </section>
        </section>
      </section>
    </main>
  );
}
