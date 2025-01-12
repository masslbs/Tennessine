// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";

import CustomerViewProducts from "./CustomerViewListings.tsx";
import { useKeycard } from "../hooks/useKeycard.ts";
import { useClientWithStateManager } from "../hooks/useClientWithStateManager.ts";
import MerchantViewProducts from "./merchants/listings/MerchantViewListings.tsx";

export default function Listings() {
  const { clientStateManager } = useClientWithStateManager();
  const [keycard] = useKeycard();
  const [products, setProducts] = useState(new Map());

  async function getAllListings() {
    const listings = new Map();
    for await (
      const [
        id,
        item,
      ] of clientStateManager!.stateManager.listings.iterator()
    ) {
      listings.set(id, item);
    }
    return listings;
  }

  useEffect(() => {
    async function onCreateEvent() {
      const l = new Map();
      for await (
        const [
          id,
          item,
        ] of clientStateManager!.stateManager.listings.iterator()
      ) {
        l.set(id, item);
      }
      setProducts(l);
    }
    async function onUpdateEvent() {
      const l = new Map();
      for await (
        const [
          id,
          item,
        ] of clientStateManager!.stateManager.listings.iterator()
      ) {
        l.set(id, item);
      }
      setProducts(l);
    }

    getAllListings().then((listings) => {
      setProducts(listings);
    });

    // Listen to future events
    clientStateManager!.stateManager.listings.on("create", onCreateEvent);
    clientStateManager!.stateManager.listings.on("update", onUpdateEvent);

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
  }, []);

  return (
    <main className="bg-background-gray h-screen pt-4">
      {keycard.role === "merchant"
        ? <MerchantViewProducts products={Array.from([...products.values()])} />
        : (
          <CustomerViewProducts
            products={Array.from([...products.values()])}
          />
        )}
    </main>
  );
}
