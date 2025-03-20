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

  function getAllListings() {
    return clientStateManager!.stateManager.get(["Listings"]).then(
      async (allListings: Map<ListingId, unknown>) => {
        const listings = new Map();
        for await (
          const [
            id,
            o,
          ] of allListings.entries()
        ) {
          listings.set(id, new Listing(o));
        }
        return listings;
      },
    );
  }

  useEffect(() => {
    if (!clientStateManager?.stateManager) return;
    const sm = clientStateManager.stateManager;

    function onCreateEvent() {
      getAllListings().then((items: Map<ListingId, Listing>) => {
        setProducts(items);
      });
    }

    function onUpdateEvent() {
      getAllListings().then((items: Map<ListingId, Listing>) => {
        setProducts(items);
      });
    }

    // Listen to future events
    sm.events.on("Listing", onCreateEvent);
    sm.events.on("UpdateListing", onUpdateEvent);

    getAllListings().then((items: Map<ListingId, Listing>) => {
      setProducts(items);
    });

    return () => {
      // Cleanup listeners on unmount
      sm.listings.removeListener(
        "create",
        onCreateEvent,
      );
      sm.listings.removeListener(
        "update",
        onUpdateEvent,
      );
    };
  }, [result]);

  if (!clientStateManager?.stateManager) {
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
