// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";

import { Listing } from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import CustomerViewListings from "./CustomerViewListings.tsx";
import { useKeycard } from "../hooks/useKeycard.ts";
import { useStateManager } from "../hooks/useStateManager.ts";
import MerchantViewListings from "./merchants/listings/MerchantViewListings.tsx";

export default function Listings() {
  const { stateManager } = useStateManager();
  const { data: keycard } = useKeycard();
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

  if (!stateManager) {
    return <main data-testid="listings-page">Loading...</main>;
  }

  function mapToListingClass(allListings: Map<CodecKey, CodecValue>) {
    const listings: Listing[] = [];
    for (const [_id, l] of allListings.entries()) {
      listings.push(Listing.fromCBOR(l));
    }
    return listings;
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
