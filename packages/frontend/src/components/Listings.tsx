// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";

import CustomerViewListings from "./CustomerViewListings.tsx";
import { useKeycard } from "../hooks/useKeycard.ts";
import { useClientWithStateManager } from "../hooks/useClientWithStateManager.ts";
import MerchantViewListings from "./merchants/listings/MerchantViewListings.tsx";
import { asyncIteratorToMap } from "../utils/mod.ts";

export default function Listings() {
  const { clientStateManager, result } = useClientWithStateManager();
  const [keycard] = useKeycard();
  const [products, setProducts] = useState(new Map());

  useEffect(() => {
    if (!clientStateManager?.stateManager) return;
    function onCreateEvent() {
      asyncIteratorToMap(clientStateManager!.stateManager.listings.iterator)
        .then(
          (listings) => {
            setProducts(listings);
          },
        );
    }
    function onUpdateEvent() {
      asyncIteratorToMap(clientStateManager!.stateManager.listings.iterator)
        .then(
          (listings) => {
            setProducts(listings);
          },
        );
    }

    // Listen to future events
    clientStateManager!.stateManager.listings.on("create", onCreateEvent);
    clientStateManager!.stateManager.listings.on("update", onUpdateEvent);
    asyncIteratorToMap(clientStateManager.stateManager.listings.iterator)
      .then(
        (listings) => {
          setProducts(listings);
        },
      );
    return () => {
      // Cleanup listeners on unmount
      clientStateManager!.stateManager.listings.removeListener(
        "create",
        onCreateEvent,
      );
      clientStateManager!.stateManager.listings.removeListener(
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
