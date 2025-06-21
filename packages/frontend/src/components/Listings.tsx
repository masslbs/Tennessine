// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";

import { Listing } from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import { useKeycard, useStateManager } from "@massmarket/react-hooks";

import CustomerViewListings from "./CustomerViewListings.tsx";
import MerchantViewListings from "./merchants/listings/MerchantViewListings.tsx";
import { ListingViewState } from "../types.ts";

function mapToListingClass(allListings: Map<CodecKey, CodecValue>) {
  const listings: Listing[] = [];
  for (const [_id, l] of allListings.entries()) {
    listings.push(Listing.fromCBOR(l));
  }
  return listings;
}

export default function Listings() {
  const { stateManager } = useStateManager();
  const { keycard } = useKeycard();
  const [products, setProducts] = useState<Listing[]>([]);

  useEffect(() => {
    if (!stateManager) return;

    function allListingsEvent(res: Map<CodecKey, CodecValue>) {
      const listings = mapToListingClass(res);
      setProducts(listings);
    }

    stateManager.get(["Listings"]).then((res: CodecValue | undefined) => {
      if (!res) return;
      if (!(res instanceof Map)) {
        throw new Error("Listings is not a Map");
      }
      const listings = mapToListingClass(res).filter((listing) =>
        listing.ViewState !== ListingViewState.Deleted
      );
      setProducts(listings);
    });

    stateManager.events.on(allListingsEvent, ["Listings"]);

    return () => {
      stateManager.events.off(
        allListingsEvent,
        ["Listings"],
      );
    };
  }, [stateManager]);

  if (!stateManager) {
    return <main data-testid="listings-page">Loading...</main>;
  }

  return (
    <main
      className="bg-background-gray"
      data-testid="listings-page"
    >
      {keycard?.role === "merchant"
        ? <MerchantViewListings products={products} />
        : (
          <CustomerViewListings
            products={products}
          />
        )}
    </main>
  );
}
