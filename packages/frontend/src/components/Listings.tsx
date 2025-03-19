// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";

import {Listing} from "@massmarket/schema"

import CustomerViewListings from "./CustomerViewListings.tsx";
import { useKeycard } from "../hooks/useKeycard.ts";
import { useClientWithStateManager } from "../hooks/useClientWithStateManager.ts";
import MerchantViewListings from "./merchants/listings/MerchantViewListings.tsx";
import { mapToListingsClass } from "../utils/mod.ts";

export default function Listings() {
  const { clientStateManager, result } = useClientWithStateManager();
  const [keycard] = useKeycard();
  const [products, setProducts] = useState<Map<ListingId, Listing>>(new Map());


 function setAllListings(map: Map<ListingId, Listing>){
  sm.get(["Listings"]).then((allListings)=>{
    mapToListingsClass(allListings).then((map)=>{
      setProducts(map)
    })  
  })
 }

  useEffect(() => {
    if (!clientStateManager?.stateManager) return;
    const sm = clientStateManager.stateManager

    function onCreateEvent() {
     setAllListings()
    }

    function onUpdateEvent() {
      setAllListings()
    }

    // Listen to future events
    sm.events.on("Listing", onCreateEvent);
    sm.events.on("UpdateListing", onUpdateEvent);

    setAllListings()

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
