// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";

import { Listing } from "@massmarket/schema";

import CustomerViewListings from "./CustomerViewListings.tsx";
import { useKeycard } from "../hooks/useKeycard.ts";
import { useStateManager } from "../hooks/useStateManager.ts";
import MerchantViewListings from "./merchants/listings/MerchantViewListings.tsx";
import { ListingId } from "../types.ts";

export default function Listings() {
  const { stateManager } = useStateManager();
  const [keycard] = useKeycard();
  const [products, setProducts] = useState<Listing[]>([]);

  if (!stateManager) {
    return <main data-testid="listings-page">Loading...</main>;
  }

  function mapToListingClass(allListings: Map<ListingId, unknown>) {
    const listings: Listing[] = [];
    for (const [_id, l] of allListings.entries()) {
      listings.push(Listing.fromCBOR(l));
    }
    return listings;
  }

  useEffect(() => {
    if (!stateManager) return;

    function allListingsEvent(res: Map<ListingId, unknown>) {
      const listings = mapToListingClass(res);
      setProducts(listings);
    }

    stateManager.get(["Listings"]).then((res: Map<ListingId, unknown>) => {
      const listings = mapToListingClass(res);
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

  return (
    <main
      className="bg-background-gray pt-under-nav"
      data-testid="listings-page"
    >
      {keycard.role === "merchant"
        ? <MerchantViewListings products={products} />
        : (
          <CustomerViewListings
            products={products}
          />
        )}
    </main>
  );
}
