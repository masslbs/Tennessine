// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";

import { Listing } from "@massmarket/schema";

import CustomerViewListings from "./CustomerViewListings.tsx";
import { useKeycard } from "../hooks/useKeycard.ts";
import { useClientWithStateManager } from "../hooks/useClientWithStateManager.ts";
import MerchantViewListings from "./merchants/listings/MerchantViewListings.tsx";
import { ListingId } from "../types.ts";

export default function Listings() {
  const { clientStateManager, result } = useClientWithStateManager();
  const [keycard] = useKeycard();
  const [products, setProducts] = useState<Map<ListingId, Listing>>(new Map());
  const sm = clientStateManager?.stateManager;

  function mapToListingClass(allListings: Map<ListingId, unknown>) {
    const listings = new Map();
    for (
      const [
        id,
        l,
      ] of allListings.entries()
    ) {
      listings.set(id, Listing.fromCBOR(l));
    }
    return listings;
  }

  useEffect(() => {
    if (!sm) return;

    function allListingsEvent(res: Map<ListingId, unknown>) {
      const listings = mapToListingClass(res);
      setProducts(listings);
    }

    sm.get(["Listings"]).then((res: Map<ListingId, unknown>) => {
      const listings = mapToListingClass(res);
      setProducts(listings);
    });

    sm.events.on(allListingsEvent, ["Listings"]);

    return () => {
      sm.events.off(
        allListingsEvent,
        ["Listings"],
      );
    };
  }, [result, sm]);

  if (!sm) {
    return <main data-testid="listings-page">Loading...</main>;
  }

  return (
    <main
      className="bg-background-gray pt-under-nav"
      data-testid="listings-page"
    >
      {keycard.role === "merchant"
        ? <MerchantViewListings products={Array.from([...products.values()])} />
        : (
          <CustomerViewListings
            products={Array.from([...products.values()])}
          />
        )}
    </main>
  );
}
