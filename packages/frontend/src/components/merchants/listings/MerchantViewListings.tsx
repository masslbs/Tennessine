// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useState } from "react";
import { getLogger } from "@logtape/logtape";
import { Link } from "@tanstack/react-router";
import { formatUnits } from "viem";

import { Listing } from "@massmarket/schema";

import Button from "../../common/Button.tsx";
import { ListingViewState } from "../../../types.ts";
import { useBaseToken } from "../../../hooks/useBaseToken.ts";
import { useStateManager } from "../../../hooks/useStateManager.ts";
import ChevronRight from "../../common/ChevronRight.tsx";

const logger = getLogger(["mass-market", "frontend", "MerchantViewListings"]);

export default function MerchantViewProducts({
  products,
}: {
  products: Listing[] | null;
}) {
  const { baseToken } = useBaseToken();
  const { stateManager } = useStateManager();
  const [stockLevels, setStockLevels] = useState<Map<number, number>>(
    new Map(),
  );

  useEffect(() => {
    if (!stateManager || !products) return;
    const stockLevels = new Map<number, number>();

    (async () => {
      await Promise.all(products.map(async (item: Listing) => {
        const quantity = await stateManager.get([
          "Inventory",
          item.ID,
        ]) as number;
        stockLevels.set(item.ID, quantity);
      }));
      setStockLevels(stockLevels);
    })();
  }, [stateManager, products]);

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
    return products.map((item: Listing) => {
      const visible = item.ViewState === ListingViewState.Published;
      const quantity = stockLevels.get(item.ID) ?? 0;

      let productImage = "/assets/no-image.png";
      if (item.Metadata.Images && item.Metadata.Images.length > 0) {
        productImage = item.Metadata.Images[0];
      }

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
          <div
            className="flex justify-center h-[100px] relative"
            data-testid="product-img"
          >
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
            <div
              id="live-badge"
              className={`${
                visible
                  ? "flex justify-center items-center bg-[#9BFF9F] rounded-full absolute w-19 h-[18px] top-[10px] left-[5px]"
                  : "hidden"
              } `}
            >
              <p className="text-sm font-light">Live</p>
            </div>
          </div>
          <div className="bg-background-gray w-full rounded-r-lg px-5 py-[10px] flex flex-col h-[100px] md:w-[203px]">
            <div className="flex border-b border-gray-300 w-full py-1 gap-2">
              <h3 data-testid="product-name" className="leading-4 line-clamp-1">
                {item.Metadata.Title}
              </h3>
              <div className="ml-auto flex items-center">
                <ChevronRight />
              </div>
            </div>
            <div className="text-sm flex justify-between border-b border-gray-300 w-full py-1 font-inter">
              <p>Stock Level</p>
              <p>{quantity}</p>
            </div>
            <div className="flex justify-between pt-1">
              <p className="text-sm font-inter">Price</p>
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
                <p data-testid="product-price" className="truncate">
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
    <main className="md:flex justify-center">
      <section
        className="mx-5 md:mx-8 pt-3"
        data-testid="merchant-view-listings"
      >
        <div className="flex gap-5">
          <h1 className="grow flex items-center md:flex-none">
            Manage Products ({products?.length})
          </h1>
          <Button custom="w-fit max-h-fit">
            <Link
              to="/edit-listing"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
                itemId: "new",
              })}
              style={{
                color: "white",
                overflow: "hidden",
                whiteSpace: "nowrap",
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
