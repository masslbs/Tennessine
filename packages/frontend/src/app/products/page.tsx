// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useUserContext } from "@/context/UserContext";
import { useClient } from "@/context/AuthContext";
import withClient from "@/app/components/withClient";
import SuccessMessage from "@/app/common/components/SuccessMessage";
import MerchantViewProducts from "@/app/components/products/MerchantViewProducts";
import CustomerViewProducts from "@/app/components/products/CustomerViewProducts";

const Products = () => {
  const searchParams = useSearchParams();
  const { clientWithStateManager } = useUserContext();
  const success = searchParams?.get("success");
  const { isMerchantView } = useClient();

  const [showSuccessMsg, setMsg] = useState<boolean>(success !== null);
  const [products, setProducts] = useState(new Map());

  const getAllListings = async () => {
    const listings = new Map();
    for await (const [
      id,
      item,
    ] of clientWithStateManager.stateManager.listings.iterator()) {
      listings.set(id, item);
    }
    return listings;
  };

  useEffect(() => {
    const onCreateEvent = async () => {
      const l = new Map();
      for await (const [
        id,
        item,
      ] of clientWithStateManager.stateManager.listings.iterator()) {
        l.set(id, item);
      }
      setProducts(l);
    };
    const onUpdateEvent = async () => {
      const l = new Map();
      for await (const [
        id,
        item,
      ] of clientWithStateManager.stateManager.listings.iterator()) {
        l.set(id, item);
      }
      setProducts(l);
    };

    getAllListings().then((listings) => {
      setProducts(listings);
    });

    // Listen to future events
    clientWithStateManager.stateManager.listings.on("create", onCreateEvent);
    clientWithStateManager.stateManager.listings.on("update", onUpdateEvent);

    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager.stateManager.listings.removeListener(
        "create",
        onCreateEvent,
      );
      clientWithStateManager.stateManager.listings.removeListener(
        "update",
        onUpdateEvent,
      );
    };
  }, []);

  return (
    <main className="bg-background-gray pt-under-nav h-screen">
      <SuccessMessage show={showSuccessMsg} onClose={() => setMsg(false)} />
      {isMerchantView ? (
        <MerchantViewProducts products={Array.from([...products.values()])} />
      ) : (
        <CustomerViewProducts products={Array.from([...products.values()])} />
      )}
    </main>
  );
};

export default withClient(Products);
